import { Badge, Button, Card, CardContent, Separator } from '@ielts/ui';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found - IELTS Vocabs',
  description: 'The requested page could not be found.',
};

export default function NotFound() {
  return (
    <main className="flex items-center justify-center bg-background p-4 min-h-[80vh] w-full">
      <div className="container max-w-lg mx-auto">
        <Card className="border border-border bg-card">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between w-full">
                <h1 className="text-4xl font-extrabold text-primary font-mono">
                  404
                </h1>
                <Badge variant="destructive" className="px-3 py-1 rounded-full text-xs font-semibold">
                  Error
                </Badge>
              </div>

              <div className="w-full">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider block mb-2">
                  Definition
                </span>
                <p className="text-lg text-foreground leading-relaxed">
                  <span className="font-bold text-primary">
                    /four-oh-four/
                  </span>{' '}
                  (noun)
                  <br />
                  The digital state of being entirely lost; a webpage that has vanished like a
                  difficult vocabulary word during an exam.
                </p>
              </div>

              <Separator className="bg-border/40" />

              <div className="w-full">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider block mb-2">
                  Example Sentence
                </span>
                <p className="text-base text-muted-foreground font-medium italic">
                  &quot;The user searched for a page, but encountered a{' '}
                  <span className="text-primary font-semibold">
                    404
                  </span>{' '}
                  and decided to learn a new word instead.&quot;
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2 items-center justify-center font-semibold mt-4"
              >
                <Link href="/vocabulary">
                  <ArrowLeft size={20} />
                  Back to Learning
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
