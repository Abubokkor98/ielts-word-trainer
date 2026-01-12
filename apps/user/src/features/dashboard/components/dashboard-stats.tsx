import { SimpleGrid } from '@chakra-ui/react';
import { StatCard } from './stat-card';
import { formatRelativeTime } from '@ielts/shared';

interface DashboardStatsProps {
  xp: number;
  streak: number;
  quizzesTaken: number;
  avgScore: number;
  lastQuizDate?: string;
}

export function DashboardStats({
  xp,
  streak,
  quizzesTaken,
  avgScore,
  lastQuizDate,
}: DashboardStatsProps) {
  const lastQuiz = formatRelativeTime(lastQuizDate);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
      <StatCard label="Total XP" value={xp} color="brand.400" />
      <StatCard
        label="Current Streak"
        value={streak}
        icon="🔥"
        color="orange.400"
      />
      <StatCard label="Quizzes Taken" value={quizzesTaken} color="purple.400" />
      <StatCard
        label="Average Score"
        value={`${avgScore}%`}
        color="green.400"
      />
      <StatCard label="Last Quiz" value={lastQuiz} icon="📅" color="blue.400" />
    </SimpleGrid>
  );
}
