export const getDifficultyColorScheme = (
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string
): string => {
  switch (difficulty) {
    case 'beginner':
      return 'green';
    case 'intermediate':
      return 'yellow';
    case 'advanced':
      return 'red';
    default:
      return 'gray';
  }
};
