'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import UsernameMenu from '@/components/common/username-menu';
import { useAuth } from '@/context/AuthContext';
import CarbonCount from '@/components/common/CarbonCount';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setIdeas } from '@/store/slices/ideasSlice';
import toast from 'react-hot-toast';

type PlayerIdea = {
  _id: string;
  username: string;
  ideaTitle: string;
  carbonCount: number;
  w3w: string;
};

const columns: ColumnDef<PlayerIdea>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button className="has-[>svg]:px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Username
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'ideaTitle',
    header: ({ column }) => {
      return (
        <Button className="has-[>svg]:px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Idea title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('ideaTitle')}</div>,
  },
  {
    accessorKey: 'carbonCount',
    header: ({ column }) => {
      return (
        <Button className="has-[>svg]:px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Final score
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('carbonCount')}</div>,
  },
  {
    accessorKey: 'w3w',
    header: 'W3W square',
    cell: ({ row }) => {
      const w3w = row.getValue('w3w') as string;
      return (
        <a href={`https://what3words.com/${w3w}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {w3w}
        </a>
      );
    },
  },
];

function PlayerIdeasTable() {
  const ideas = useSelector((state: RootState) => state.ideas.ideas);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'carbonCount',
      desc: false
    }
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: ideas,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
  };

  return (
    <div className="w-full">
      <div className="text-center text-2xl font-semibold">Leaderboard</div>
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search username, score, or W3W square" value={globalFilter ?? ''} onChange={handleFilterChange} className="pl-8 max-w-xs bg-white" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[411.5px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4 px-2">
        <div className="text-sm text-gray-600">{table.getFilteredRowModel().rows.length} results found</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="border-gray-200 hover:bg-gray-50">
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="border-gray-200 hover:bg-gray-50">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/ideas", {
          method: "GET",
        });

        const ideas = await response.json();

        if (!response.ok) {
          toast.error(ideas?.message || "Failed to fetch ideas");
          return;
        }

        dispatch(setIdeas(ideas));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();

    return () => {};
  }, []);

  const handleClick = () => {
    router.push('/new-idea');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between mb-4 gap-2 flex-wrap">
        {user ? (
          <UsernameMenu />
        ) : (
          <Button onClick={() => router.push('/login')} className="bg-gray-700 hover:bg-gray-900 text-white">
            Login
          </Button>
        )}
 
        <CarbonCount className='text-lg px-3 py-2'/>
        <Button onClick={handleClick} className="bg-emerald-600 hover:bg-emerald-800 text-white">
          New Idea
        </Button>
      </div>
      <PlayerIdeasTable />
    </div>
  );
}
