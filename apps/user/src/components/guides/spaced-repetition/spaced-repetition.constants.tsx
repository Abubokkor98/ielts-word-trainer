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
    id: 'what-is-srs',
    number: '1',
    title: 'What Is Spaced Repetition?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Spaced repetition is an evidence-based learning technique that schedules review sessions at increasing intervals to combat the brain&apos;s natural forgetting process. Instead of attempting to memorize vast lists of vocabulary words in a single sitting, this method spaces reviews over time, shifting information from short-term memory into permanent, long-term memory.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          This system is rooted in <strong className="text-white">Hermann Ebbinghaus&apos;s</strong> pioneering cognitive research from 1885 on memory decay. He discovered that without structured review, the human brain naturally forgets about 50% of new information within 24 hours, 70% within a week, and 90% within a month.
        </p>
      </div>
    ),
  },
  {
    id: 'forgetting-curve',
    number: '2',
    title: 'The Forgetting Curve & Review Spacing',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The Forgetting Curve represents the mathematical decay of memory over time. However, Ebbinghaus discovered a crucial hack: reviewing material <strong className="text-primary font-semibold">just before it fades</strong> drastically resets the forgetting curve and strengthens the memory trace:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Initial Decay:</strong> The first time you learn a word, your memory of it decays very rapidly.
          </li>
          <li>
            <strong className="text-white">Interval Expansion:</strong> Each time you review the word successfully, the memory decays at a much slower rate than before.
          </li>
          <li>
            <strong className="text-white">The Boost Effect:</strong> Because the memory decays slower after each review, you can leave progressively longer intervals between subsequent review sessions (e.g., Day 1 → Day 3 → Day 7 → Day 30).
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'srs-vs-cramming',
    number: '3',
    title: 'Why Spaced Repetition Beats Cramming',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Cramming (massed practice) works temporarily to pass an exam the next morning, but it is highly inefficient for long-term retention. Spaced repetition distributes study time, yielding superior retention with less total study hours:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Metric</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Spaced Repetition</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Cramming / Rote Memorization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { metric: 'Retention after 2 weeks', srs: '80–90%+', cram: '20–30%' },
                { metric: 'Retention after 70 days', srs: 'Most words retained in active memory', cram: 'Less than 10% retained' },
                { metric: 'Study time efficiency', srs: 'High (10-30 minutes of daily micro-sessions)', cram: 'Low (Hours of exhausting, repetitive study)' },
                { metric: 'Cognitive load / Stress', srs: 'Low (Feels like an engaging game, low fatigue)', cram: 'Very high (Severe fatigue, high burn-out rate)' },
                { metric: 'Transition to active use', srs: 'Highly effective (Gradually solidifies in brain)', cram: 'Ineffective (Forgotten immediately after exam)' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.metric}</TableCell>
                  <TableCell className="text-primary font-semibold text-xs sm:text-sm">{row.srs}</TableCell>
                  <TableCell className="text-right text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.cram}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed pt-2">
          👉 Science Fact: Spaced repetition produces over 200% better long-term retention than traditional rote learning with up to 50% less total study time!
        </p>
      </div>
    ),
  },
  {
    id: 'scientific-evidence',
    number: '4',
    title: 'Scientific Evidence Supporting Spaced Retrieval',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Decades of cognitive psychology and second-language acquisition (SLA) studies validate the power of spaced practice:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Vocabulary Retention Study (Swansea University, 2019):</strong> A longitudinal field study evaluated L2 vocabulary learning over 70 days. The researchers found that most words were successfully retained in long-term memory when using spaced intervals compared to massed study models.
          </li>
          <li>
            <strong className="text-white">Spacing Effect on L2 Vocabulary (2023):</strong> A controlled study of 67 second-language learners demonstrated that expanding study intervals significantly outperformed traditional rote memorization in both vocabulary recognition and active usage.
          </li>
          <li>
            <strong className="text-white">Ebbinghaus Replication (NIH, 2015):</strong> A modern replication of the classic 1885 forgetting curve successfully validated the mathematical, exponential nature of forgetting, solidifying Ebbinghaus&apos;s models as the baseline for modern learning algorithms.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'expected-results',
    number: '5',
    title: 'Expected Results & Study Metrics',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Here is what dedicated vocabulary learners can realistically expect when adhering strictly to spaced repetition principles:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">90%+ long-term retention</strong> compared to just 20-30% with traditional cramming methods.
          </li>
          <li>
            <strong className="text-white">3x faster vocabulary acquisition</strong> because study time is not wasted reviewing words you already know well.
          </li>
          <li>
            <strong className="text-white">10–30 minutes per day</strong> is all it takes to build and maintain a vocabulary library of several thousand active words.
          </li>
          <li>
            <strong className="text-white">Permanent recall</strong> of core vocabulary even after months of zero active review sessions.
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
          This guide is compiled for educational purposes to explain memory science principles. The cognitive studies mentioned (Ebbinghaus, Swansea L2, SLA) are peer-reviewed research papers. For further reading, consult resources published by the National Institutes of Health (NIH) or cognitive science departments.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
