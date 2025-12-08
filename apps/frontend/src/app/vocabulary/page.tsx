'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@ielts/ui';
import Link from 'next/link';

interface Word {
  _id: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  difficulty: string;
}

export default function VocabularyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchWords();
  }, [page]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/words?page=${page}&limit=12`);
      if (data.success) {
        setWords(data.data.words);
        setTotalPages(data.data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Vocabulary Library
        </h2>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <Card key={word._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{word.word}</CardTitle>
                  <span className="text-xs uppercase bg-secondary px-2 py-1 rounded text-secondary-foreground">
                    {word.difficulty}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <p className="font-medium text-muted-foreground">
                  {word.meaning}
                </p>
                <p className="text-sm italic">"{word.exampleSentence}"</p>
              </CardContent>
              <CardFooter className="pt-4">
                <Button  className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="flex items-center px-4 text-sm font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
