import { Button, Card, CardHeader, CardTitle, CardContent } from '@ielts/ui';
import Link from 'next/link';

export default function Index() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4 py-12 md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Master 1000+ IELTS Words
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Boost your band score with our science-backed Spaced Repetition System
          (SRS).
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/vocabulary">
            <Button >Start Learning</Button>
          </Link>
          <Link href="/quiz"> 
            <Button   >
              Take a Quiz
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Spaced Repetition</CardTitle>
          </CardHeader>
          <CardContent>
            Review words at optimal intervals to maximize retention.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Topic Modules</CardTitle>
          </CardHeader>
          <CardContent>
            Learn vocabulary organized by common IELTS topics.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Smart Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            Test your knowledge with adaptive quizzes and instant feedback.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
