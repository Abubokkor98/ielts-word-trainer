import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';
import type { RecentAttempt } from '../types';

interface RecentAttemptsTableProps {
  attempts: RecentAttempt[];
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const fullFormat = date
    .toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', ' at');

  const mobileDateOnly = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });

  const timeOnly = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { fullFormat, mobileDateOnly, timeOnly };
};

export function RecentAttemptsTable({ attempts }: RecentAttemptsTableProps) {
  if (!attempts || attempts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Recent Attempts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt) => {
              const { fullFormat, mobileDateOnly, timeOnly } = formatDateTime(
                attempt.completedAt,
              );

              return (
                <TableRow key={attempt._id as string}>
                  <TableCell className="text-foreground">
                    {/* Desktop */}
                    <span className="hidden md:inline whitespace-nowrap">
                      {fullFormat}
                    </span>
                    {/* Mobile */}
                    <span className="md:hidden flex flex-col">
                      <span className="text-sm font-medium whitespace-nowrap">
                        {mobileDateOnly}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {timeOnly}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {attempt.difficulty?.toUpperCase() || 'MIXED'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-foreground font-medium">
                    {attempt.score}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
