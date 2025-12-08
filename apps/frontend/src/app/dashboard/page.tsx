'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@ielts/ui';
import { useRouter } from 'next/navigation';

interface Stats {
  totalUsers: number;
  totalWords: number;
  totalQuizzesTaken: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In real app, check auth state first
    const token = localStorage.getItem('accessToken');
    if (!token) router.push('/login');

    api
      .get('/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data.data))
      .catch((err) => {
        console.error(err);
        // If 403/401, redirect
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Stats...</div>;
  if (!stats) return <div>Access Denied or Error</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Words</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats.totalWords}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quizzes Taken</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats.totalQuizzesTaken}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
