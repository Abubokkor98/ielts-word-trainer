import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';

// ============================================================================
// Types
// ============================================================================

interface BandTableRow {
  readonly band: string;
  readonly desc: string;
}

interface BandTableProps {
  readonly headerLabel: string;
  readonly rows: readonly BandTableRow[];
  /** 'narrow' uses w-[60px] with mono/primary band styling; 'wide' uses w-1/4 with plain white styling */
  readonly variant?: 'narrow' | 'wide';
}

// ============================================================================
// Component
// ============================================================================

export function BandTable({ headerLabel, rows, variant = 'narrow' }: BandTableProps) {
  const isNarrow = variant === 'narrow';

  return (
    <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
      <Table>
        <TableHeader className="bg-zinc-900/50">
          <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
            <TableHead
              className={`${isNarrow ? 'w-[60px]' : 'w-1/4'} text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider`}
            >
              Band
            </TableHead>
            <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">
              {headerLabel}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={row.band}
              className={`hover:bg-zinc-800/20 ${idx === rows.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}
            >
              <TableCell
                className={
                  isNarrow
                    ? 'font-mono font-bold text-primary text-xs sm:text-sm'
                    : 'font-semibold text-white text-xs sm:text-sm'
                }
              >
                {row.band}
              </TableCell>
              <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {row.desc}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
