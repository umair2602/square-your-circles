'use client';
import BrandWatermark from '@/components/common/BrandWatermark';
import Navbar from '@/components/common/Navbar';
import TopLeaderboard from '@/components/common/TopLeaderboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import type { RootState } from '@/store';
import { setIdeas } from '@/store/slices/ideasSlice';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
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

function PlayerIdeasTable() {
  const ideas = useSelector((state: RootState) => state.ideas.ideas);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'carbonCount',
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<PlayerIdea>[] = [
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button className="has-[>svg]:px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Username
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue('username')}</div>,
    },
    {
      accessorKey: 'ideaTitle',
      header: ({ column }) => {
        return (
          <Button className="has-[>svg]:px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Idea title
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="truncate max-w-[150px] md:max-w-[200px]">{row.getValue('ideaTitle')}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'carbonCount',
      header: ({ column }) => {
        return (
          <Button className="has-[>svg]:px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Final score
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-semibold text-right">{Number(row.getValue('carbonCount')).toLocaleString()}</div>,
    },
    {
      accessorKey: 'w3w',
      header: 'W3W square',
      cell: ({ row }) => {
        const w3w = row.getValue('w3w') as string;
        return (
          <a href={`https://what3words.com/${w3w}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate block max-w-[100px] md:max-w-full">
            {w3w}
          </a>
        );
      },
      enableHiding: true,
    },
  ];

  const table = useReactTable({
    data: ideas,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility: {
        ideaTitle: window.innerWidth > 640, // Hide on mobile
        w3w: window.innerWidth > 480, // Hide on small mobile
      },
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

  // Add responsive column visibility on window resize
  useEffect(() => {
    const handleResize = () => {
      table.setColumnVisibility({
        ideaTitle: window.innerWidth > 640,
        w3w: window.innerWidth > 480,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [table]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 flex-wrap py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search username, score, or W3W square" value={globalFilter ?? ''} onChange={handleFilterChange} className="pl-8 w-full max-w-xs bg-white" />
        </div>
        <div className="text-sm text-gray-600">{table.getFilteredRowModel().rows.length} results</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[411.5px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
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
      </div>
      <div className="flex items-center justify-between py-4 px-2">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="border-gray-200 hover:bg-gray-50">
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="border-gray-200 hover:bg-gray-50">
            Next
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}

// Define animation variants
const digitVariants: Variants = {
  hidden: {
    y: -30,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    y: 30,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

/**
 * AnimatedDigit - Shows a single digit with animation when it changes
 */
function AnimatedDigit({ value, index }: { value: string; index: number }) {
  return (
    <div className="inline-block w-[0.6em] h-[1.2em] relative overflow-hidden text-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={`${value}-${index}`}
          variants={digitVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}


export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const currentPpm = useSelector((state: any) => state.carbonCount.currentPpm);
  const [formattedPpm, setFormattedPpm] = useState("427.75572087");

  useEffect(() => {
    if (currentPpm) {
      setFormattedPpm(currentPpm.toFixed(8));
    }
  }, [currentPpm]);

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
  }, [dispatch]);

  const handleClick = () => {
    router.push('/new-idea');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Background watermark */}
      <BrandWatermark opacity={0.05} size="90vh" blur={1.2} offsetY={20} />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        {/* Carbon Clock Section - Full Viewport Height */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-8 relative">
          <div className="max-w-4xl mx-auto w-full text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3 tracking-tight">Carbon Clock</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-10 sm:mb-12">Tracking global carbon dioxide levels in real-time</p>

            <div className="text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem] font-bold text-[#576574] tracking-tight mb-2 sm:mb-4 leading-none whitespace-nowrap">
              {formattedPpm.split('').map((digit, index) => (
                <AnimatedDigit key={index} value={digit} index={index} />
              ))}
            </div>
            <div className="text-xl sm:text-2xl text-gray-600 font-medium mb-16 sm:mb-20">parts per million</div>

            <div className="mt-8 max-w-md mx-auto">
              <TopLeaderboard />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 animate-bounce cursor-pointer"
            onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard" className="min-h-screen flex items-center bg-white px-4 sm:px-6 lg:px-8 py-20 scroll-mt-16">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Leaderboard</h2>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <PlayerIdeasTable />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
