import type { AxiosError } from 'axios';

export const isQuizLimitError = (error: AxiosError<{ message?: string }>) => {
  return (
    error.response?.status === 403 &&
    !!error.response?.data?.message?.includes('1 quiz per day')
  );
};
