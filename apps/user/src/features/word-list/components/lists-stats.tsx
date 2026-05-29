'use client';

import { Award, BookOpen, Layers } from 'lucide-react';
import type { WordList } from '../types';

interface ListsStatsProps {
  lists: WordList[];
}

export function ListsStats({ lists }: ListsStatsProps) {
  const totalLists = lists.length;

  let totalWords = 0;
  let beginnerCount = 0;
  let intermediateCount = 0;
  let advancedCount = 0;

  lists.forEach((list) => {
    list.words.forEach((word) => {
      totalWords++;
      if (word.difficulty === 'beginner') {
        beginnerCount++;
      } else if (word.difficulty === 'intermediate') {
        intermediateCount++;
      } else if (word.difficulty === 'advanced') {
        advancedCount++;
      }
    });
  });

  const beginnerPercentage = totalWords > 0 ? (beginnerCount / totalWords) * 100 : 0;
  const intermediatePercentage = totalWords > 0 ? (intermediateCount / totalWords) * 100 : 0;
  const advancedPercentage = totalWords > 0 ? (advancedCount / totalWords) * 100 : 0;

  return (
    <div className="lists-stats-container mb-8">
      {/* Total Lists Card */}
      <div className="list-stat-card">
        <div className="list-stat-card-icon">
          <BookOpen size={18} />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Total Collections
        </span>
        <h4 className="text-2xl font-extrabold text-foreground mt-1">
          {totalLists}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Organized modules for targeted study
        </p>
      </div>

      {/* Total Words Card */}
      <div className="list-stat-card">
        <div className="list-stat-card-icon">
          <Award size={18} />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Saved Words
        </span>
        <h4 className="text-2xl font-extrabold text-foreground mt-1">
          {totalWords}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Curated vocabulary definitions
        </p>
      </div>

      {/* Difficulty Breakdown Card */}
      <div className="list-stat-card sm:col-span-2">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Difficulty Profile
            </span>
            <h4 className="text-sm font-bold text-foreground mt-0.5">
              Vocabulary Mix
            </h4>
          </div>
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="flex items-center gap-1 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {beginnerCount}
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {intermediateCount}
            </span>
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {advancedCount}
            </span>
          </div>
        </div>

        {totalWords > 0 ? (
          <div className="flex flex-col gap-2.5">
            <div className="list-difficulty-bar">
              <div
                className="list-difficulty-segment bg-green-500"
                style={{ width: `${beginnerPercentage}%` }}
              />
              <div
                className="list-difficulty-segment bg-blue-500"
                style={{ width: `${intermediatePercentage}%` }}
              />
              <div
                className="list-difficulty-segment bg-purple-500"
                style={{ width: `${advancedPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 font-medium">
              <span>{Math.round(beginnerPercentage)}% Beginner</span>
              <span>{Math.round(intermediatePercentage)}% Intermediate</span>
              <span>{Math.round(advancedPercentage)}% Advanced</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 border border-dashed border-border/30 rounded-xl text-xs text-muted-foreground/60">
            <Layers size={14} className="mr-1.5 opacity-60" />
            No saved words to compute profile breakdown
          </div>
        )}
      </div>
    </div>
  );
}
