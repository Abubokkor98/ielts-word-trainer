import type { AxiosError } from 'axios';

interface QuizLimitErrorPayload {
  code?: string;
  message?: string;
}

export const isQuizLimitError = (error: AxiosError<QuizLimitErrorPayload>) => {
  return (
    error.response?.status === 403 &&
    (error.response?.data?.code === 'QUIZ_DAILY_LIMIT_UNVERIFIED' ||
      !!error.response?.data?.message?.includes('1 quiz per day'))
  );
};
