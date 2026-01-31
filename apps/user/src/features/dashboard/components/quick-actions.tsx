import { SimpleGrid } from '@chakra-ui/react';
import { ActionCard } from './action-card';

export function QuickActions() {
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <ActionCard
        href="/vocabulary"
        title="Browse Vocabulary"
        description="Explore 3500+ IELTS words"
        emoji="📚"
      />
      <ActionCard
        href="/quiz"
        title="Take a Quiz"
        description="Test your knowledge now"
        emoji="🎯"
      />
      <ActionCard
        href="/analytics"
        title="View Analytics"
        description="Check your progress"
        emoji="📊"
      />
    </SimpleGrid>
  );
}
