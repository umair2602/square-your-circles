'use client';
import UsernameMenu from '@/components/common/username-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import type { RootState } from '@/store';
import { setIdeas } from '@/store/slices/ideasSlice';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

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
      desc: false,
    },
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
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ideas', {
          method: 'GET',
        });

        const ideas = await response.json();

        if (!response.ok) {
          toast.error(ideas?.message || 'Failed to fetch ideas');
          return;
        }

        dispatch(setIdeas(ideas));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();

    return () => { };
  }, []);

  const handleClick = () => {
    router.push('/new-idea');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with auth and new idea button - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
          {user ? (
            <UsernameMenu />
          ) : (
            <Button onClick={() => router.push('/login')} className="text-white">
              Login
            </Button>
          )}
          <Button onClick={handleClick} className="bg-gray-500 hover:bg-gray-900 text-white">
            New Idea
          </Button>
        </div>
      </div>

      {/* Carbon Clock Section - Full Viewport Height */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight [text-shadow:_0_2px_10px_rgba(0,0,0,0.1)]">Carbon Clock</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">Tracking global carbon dioxide levels in real-time</p>
          {currentPpm !== 0 && (
            <div className="inline-block">
              <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-500 tracking-tight [text-shadow:_0_4px_20px_rgba(0,0,0,0.15)]">{currentPpm.toFixed(8)}</div>
              <div className="text-xl sm:text-2xl md:text-3xl text-gray-600 mt-2 md:mt-4 font-medium [text-shadow:_0_2px_10px_rgba(0,0,0,0.1)]">parts per million</div>
            </div>
          )}
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="min-h-screen flex items-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <PlayerIdeasTable />
          </div>
        </div>
      </section>
    </div>
  );
}
