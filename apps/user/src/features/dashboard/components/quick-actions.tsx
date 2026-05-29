import { BarChart3, BookOpen, BrainCircuit } from 'lucide-react';
import { ActionCard } from './action-card';

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ActionCard
        href="/vocabulary"
        title="Browse Vocabulary"
        description="Explore 3500+ IELTS words"
        icon={BookOpen}
      />
      <ActionCard
        href="/quiz"
        title="Take a Quiz"
        description="Test your knowledge now"
        icon={BrainCircuit}
      />
      <ActionCard
        href="/analytics"
        title="View Analytics"
        description="Check your progress"
        icon={BarChart3}
      />
    </div>
  );
}
