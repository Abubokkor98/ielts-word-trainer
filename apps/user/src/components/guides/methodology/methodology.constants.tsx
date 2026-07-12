import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';
import type { ReactNode } from 'react';

export interface GuideSectionData {
  readonly id: string;
  readonly title: string;
  readonly number: string;
  readonly content: ReactNode;
}

export const GUIDE_SECTIONS: readonly GuideSectionData[] = [
  {
    id: 'our-engine',
    number: '1',
    title: 'How Does Our Spaced Repetition Engine Work?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          IELTS Vocabs is powered by a sophisticated, automated spaced repetition algorithm (modeled after the industry-standard SM-2 and FSRS-5 cognitive frameworks). Instead of using a random flashcard system, our software continuously computes your personal recall strength for every single word, scheduling reviews at the exact mathematical point of near-forgetting to maximize long-term retention.
        </p>
      </div>
    ),
  },
  {
    id: 'review-stages',
    number: '2',
    title: 'What Are the Review Stages and Timing?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          When you introduce a new vocabulary word to your study queue, the engine guides it through progressive learning stages to secure it in your long-term memory:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Review Stage</TableHead>
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Timing Interval</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Methodology Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { stage: 'First learning', time: 'Day 1', purpose: 'Initial exposure to spelling, meaning, pronunciation, and contextual sentences' },
                { stage: 'First review', time: 'Day 3', purpose: 'Prevent early forgetting (resets decay curves when retention starts to dip)' },
                { stage: 'Second review', time: 'Day 7', purpose: 'Strengthen memory trace (doubles the durability of the neural pathways)' },
                { stage: 'Third review', time: 'Day 30', purpose: 'Secure in long-term memory (prepares word for rapid active retrieval)' },
                { stage: 'Ongoing reviews', time: 'Increasing intervals', purpose: 'Maintain 90%+ long-term retention with minimal review load' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.stage}</TableCell>
                  <TableCell className="text-primary font-mono text-xs sm:text-sm font-semibold">{row.time}</TableCell>
                  <TableCell className="text-right text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'how-engine-works',
    number: '3',
    title: 'How Does the Algorithm Calculate Review Intervals?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The scheduling engine runs continuously in the background, analyzing your inputs to customize your learning journey:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Individual Performance Tracking:</strong> Each time you review a word, you rate your memory ease (Easy, Medium, Difficult).
          </li>
          <li>
            <strong className="text-white">Dynamic Interval Adaptation:</strong> The algorithm adjusts review timelines. Words you struggle with (rated Difficult) are repeated frequently; words you know well (rated Easy) are pushed weeks into the future.
          </li>
          <li>
            <strong className="text-white">Efficiency Maximization:</strong> By bypassing vocabulary you already master, you save hundreds of hours of study time compared to reading raw word lists.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'srs-vs-traditional',
    number: '4',
    title: 'How Does Spaced Repetition Compare to Traditional Word Lists?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Most candidates fail to secure a Band 7+ vocabulary score because they rely on passive, linear list reading. Compare how our active, adaptive system outperforms legacy methods:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Traditional Word Lists</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Our Spaced Repetition Approach</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Review schedule', trad: 'Random or completely up to the candidate', srs: 'Scientifically optimized by cognitive algorithm' },
                { aspect: 'Context', trad: 'Isolated words with single-word definitions', srs: 'Curated IELTS-style sentences displaying collocations' },
                { aspect: 'Efficiency', trad: 'Low (Wastes time reviewing known words over and over)', srs: 'High (Focuses heavily on words you struggle with)' },
                { aspect: 'Retention', trad: 'Over 80% forgotten within two weeks', srs: 'Over 80% retained after months of zero study' },
                { aspect: 'Application', trad: 'Receptive recognition only (Reading/Listening)', srs: 'Productive activation (Writing/Speaking modules)' },
                { aspect: 'Motivation', trad: 'Boring, repetitive, and easily abandoned', srs: 'Gamified, progress-tracked, and adaptive' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 5 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.trad}</TableCell>
                  <TableCell className="text-right text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.srs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'ielts-customizations',
    number: '5',
    title: 'What IELTS-Specific Methodologies Do We Use?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Unlike basic, generic flashcard apps, IELTS Vocabs is custom-engineered from the ground up specifically for IELTS candidates to target the &ldquo;Lexical Resource&rdquo; marking parameters:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Context-Based Learning:</strong> We never show words in isolation. Every card displays the vocabulary word embedded inside an IELTS-style sentence, showing natural collocations (word pairings) and usage rules you can copy in your Writing and Speaking responses.
          </li>
          <li>
            <strong className="text-white">Native British Pronunciation Audio:</strong> Every single card is integrated with high-quality British English voice recordings, helping you master phonemes, syllable stress, and accents to boost your Speaking test Pronunciation score.
          </li>
          <li>
            <strong className="text-white">Topic-Based Vocabulary Decks:</strong> Our vocabulary library is systematically organized into high-frequency IELTS exam topics (Environment, Education, Technology, Health, Globalization, Urbanization).
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'disclaimer',
    number: '6',
    title: 'Disclaimer & Sources',
    content: (
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <p className="text-xs leading-relaxed text-zinc-500 font-sans">
          This guide outlines the proprietary cognitive methodologies and software scheduling engines developed for the IELTS Vocabs application. These algorithms (SM-2, FSRS-5) are standard, publicly validated memory frameworks.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
