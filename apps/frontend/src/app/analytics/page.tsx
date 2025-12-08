'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@ielts/ui';

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/quiz/analytics/me');
      return res.data.data;
    },
  });

  if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Quiz Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data?.totalAttempts}</div>
            <div className="text-sm text-muted-foreground">Total Attempts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data?.averageScore}%</div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{data?.bestScore}%</div>
            <div className="text-sm text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {data?.averageTimePerQuestion}s
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Time/Question
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(data?.performanceByDifficulty || {}).map(
            ([key, val]: any) => (
              <div key={key} className="flex justify-between py-2">
                <span className="capitalize">{key}</span>
                <span>
                  {val.averageScore}% ({val.attempts} attempts)
                </span>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentAttempts?.map((attempt: any) => (
            <div
              key={attempt.id}
              className="flex justify-between py-2 border-b"
            >
              <span>{new Date(attempt.date).toLocaleDateString()}</span>
              <span>{attempt.percentage}%</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
