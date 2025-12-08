'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@ielts/ui';

export default function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      return res.data.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Name:</strong> {data?.name}
          </div>
          <div>
            <strong>Email:</strong> {data?.email}
          </div>
          <div>
            <strong>XP:</strong> {data?.xp}
          </div>
          <div>
            <strong>Streak:</strong> {data?.streak} days
          </div>
          <div>
            <strong>Verified:</strong> {data?.emailVerified ? 'Yes' : 'No'}
          </div>
          <div className="mt-4">
            <h3 className="font-bold">Quiz Statistics</h3>
            <p>Total Attempts: {data?.stats?.totalAttempts || 0}</p>
            <p>Average Score: {data?.stats?.averageScore || 0}%</p>
            <p>Best Score: {data?.stats?.bestScore || 0}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
