import { formatRelativeTime } from '@ielts/shared';
import { StatCard } from './stat-card';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard label="Total XP" value={xp} className="text-primary" />
      <StatCard label="Current Streak" value={streak} icon="🔥" className="text-primary" />
      <StatCard label="Quizzes Taken" value={quizzesTaken} className="text-primary" />
      <StatCard label="Average Score" value={`${avgScore}%`} className="text-primary" />
      <StatCard label="Last Quiz" value={lastQuiz} icon="📅" className="text-foreground" />
    </div>
  );
}
