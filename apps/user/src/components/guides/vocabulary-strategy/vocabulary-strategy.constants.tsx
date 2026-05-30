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
    id: 'importance',
    number: '1',
    title: 'Why Vocabulary Is Critical for ALL 4 IELTS Sections',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Many students believe that vocabulary only impacts the Reading section. However, vocabulary is the foundation of the entire IELTS exam, directly determining your band scores across all four key modules:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">IELTS Section</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">How Vocabulary Matters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { section: 'Reading', details: 'Understanding complex academic arguments, recognizing key synonyms, and decoding paraphrased headings' },
                { section: 'Listening', details: 'Recognizing words rapidly in native accents, identifying distractors, and writing correct spellings on the answer sheet' },
                { section: 'Writing', details: 'Fulfilling the "Lexical Resource" parameter (25% of score) through precise word choice, collocations, and range' },
                { section: 'Speaking', details: 'Fulfilling the "Lexical Resource" parameter (25% of score) by speaking naturally, using idioms, and rephrasing concepts' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.section}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'lexical-resource',
    number: '2',
    title: 'The Role of &ldquo;Lexical Resource&rdquo; in Band Scores',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Lexical Resource measures your vocabulary range and precision. It constitutes exactly <strong className="text-white">25%</strong> of your total Writing and Speaking marks:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Lexical Resource Criteria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '9', criteria: 'Uses vocabulary with full flexibility and precision in all topics; uses idiomatic language naturally and accurately' },
                { band: '8', criteria: 'Uses a wide vocabulary readily and flexibly to convey precise meaning; uses less common and idiomatic vocabulary skillfully with minor inaccuracies' },
                { band: '7', criteria: 'Uses vocabulary flexibly to discuss various topics; uses some less common and idiomatic vocabulary; shows awareness of style and collocation' },
                { band: '6', criteria: 'Has a wide enough vocabulary to discuss topics at length; makes meaning clear despite some inappropriate word choices or minor spelling slips' },
                { band: '5', criteria: 'Uses vocabulary with limited flexibility; struggles to paraphrase effectively; makes noticeable errors in word choices and spelling' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.criteria}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed pt-2">
          💡 Key Insight: Moving your scores from a Band 6 to a Band 7 or 8 is almost entirely about expanding your vocabulary range, increasing precision, and naturally integrating less common or idiomatic words.
        </p>
      </div>
    ),
  },
  {
    id: 'active-passive',
    number: '3',
    title: 'Active vs. Passive Vocabulary',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Understanding the distinction between these two vocabulary types is crucial for optimizing your study hours:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Passive (Receptive) Vocabulary:</strong> Words you recognize and understand when you read or hear them. This helps you score high on the Reading & Listening sections.
          </li>
          <li>
            <strong className="text-white">Active (Productive) Vocabulary:</strong> Words you can retrieve, write, and speak accurately without prompts. This is absolutely critical for scoring Band 7+ on the Writing & Speaking sections.
          </li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          To secure a high band score, you must actively convert your passive vocabulary into active vocabulary by constructing your own sentences, repeating words aloud, and writing paragraphs.
        </p>
      </div>
    ),
  },
  {
    id: 'context-learning',
    number: '4',
    title: 'Context-Based Learning: The Right Way',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Never memorize vocabulary words in isolation! Learning a list of single words with basic definitions is highly ineffective because it ignores collocations and word partnerships:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/2 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Traditional Memorization (Avoid)</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Context-Based Learning (Our Method)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { trad: 'Learning "ubiquitous = everywhere"', srs: 'Learning "Smartphones are ubiquitous in modern classrooms."' },
                { trad: 'Memorizing dictionary definitions in isolation', srs: 'Seeing words embedded inside actual IELTS-style sentences' },
                { trad: 'Ignoring word pairings and styling rules', srs: 'Mastering natural collocations (e.g., "pose a threat", "mitigate risks")' },
                { trad: 'Struggling to apply the word under exam pressure', srs: 'Recalling sentences naturally in Speaking and Writing tasks' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.trad}</TableCell>
                  <TableCell className="text-right text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.srs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'topics',
    number: '5',
    title: 'Topic-Based Organization: What to Study',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          IELTS tests draw heavily on specific societal themes. Focusing your vocabulary preparation around these high-frequency topics is the most efficient way to study:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Topic</TableHead>
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Why It Matters</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Example Vocabulary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { topic: 'Environment', why: 'Extremely common in Writing Task 2 essays and Speaking Part 3', words: 'sustainable, carbon footprint, degradation, renewable' },
                { topic: 'Technology', why: 'Frequent in Reading passages and digital divide debates', words: 'automation, artificial intelligence, digital divide, innovation' },
                { topic: 'Education', why: 'Very common essay topic for academic training modules', words: 'curriculum, pedagogy, tertiary education, literacy rates' },
                { topic: 'Health', why: 'Regular in both Speaking cues and Task 2 argumentations', words: 'sedentary lifestyle, preventive medicine, healthcare access' },
                { topic: 'Globalization', why: 'Advanced Writing Task 2 topic focusing on culture', words: 'cultural assimilation, multinational, interconnected' },
                { topic: 'Urbanization', why: 'Commonly queried in both Academic and General modules', words: 'infrastructure, metropolitan, congestion, housing crisis' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 5 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.topic}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.why}</TableCell>
                  <TableCell className="text-right text-primary font-mono text-xs sm:text-sm leading-relaxed">{row.words}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'recommendations',
    number: '6',
    title: 'Daily Study Recommendations',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Consistency is key. Short daily study sessions are infinitely more effective for long-term memory retention than exhausting weekly cramming sessions:
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Activity</TableHead>
                  <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Time Duration</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { act: 'Learn new words', time: '15 words / day', freq: 'Daily' },
                  { act: 'Review sessions', time: '10–30 minutes', freq: 'Daily (algorithm scheduled)' },
                  { act: 'Listening / Reading practice', time: '20–30 minutes', freq: 'Daily' },
                  { act: 'Speaking practice', time: '10–15 minutes', freq: 'Daily' },
                  { act: 'Writing practice', time: '1–2 paragraphs', freq: '3-4 times per week' },
                ].map((row, idx) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.act}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.time}</TableCell>
                    <TableCell className="text-right text-primary font-semibold text-xs sm:text-sm">{row.freq}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Weekly Schedule Example
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li><strong className="text-white">Monday:</strong> 15 new words (Environment topic) + daily reviews</li>
            <li><strong className="text-white">Tuesday:</strong> Reviews + practice using new words in a writing paragraph</li>
            <li><strong className="text-white">Wednesday:</strong> 15 new words (Technology topic) + daily reviews</li>
            <li><strong className="text-white">Thursday:</strong> Reviews + speaking practice using collocations aloud</li>
            <li><strong className="text-white">Friday:</strong> 15 new words (Education topic) + daily reviews</li>
            <li><strong className="text-white">Saturday:</strong> Full weekly review + mock test section</li>
            <li><strong className="text-white">Sunday:</strong> Rest day (light review only)</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'common-mistakes',
    number: '7',
    title: 'Common Vocabulary Mistakes to Avoid',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Ensure your preparation is efficient by avoiding these frequent vocabulary pitfalls:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Candidate Mistake</TableHead>
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Why It Hurts Your Score</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">How to Fix It</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { mistake: 'Memorizing dictionary lists in isolation', why: 'You will fail to use words naturally or choose inappropriate contexts', fix: 'Learn words exclusively inside actual sentences' },
                { mistake: 'Focusing only on extremely rare words', why: 'Using bizarre, obsolete words sounds highly unnatural and caps your score', fix: 'Focus on precise, appropriate topic-specific collocations' },
                { mistake: 'Ignoring word forms', why: 'Using nouns instead of adjectives limits your grammatical score accuracy', fix: 'Learn verb/noun/adjective families together' },
                { mistake: 'Omitting active speaking/writing practice', why: 'You will recognize words on paper but freeze up trying to retrieve them', fix: 'Speak and write using new words the same day you learn them' },
                { mistake: 'Spelling mistakes', why: 'Directly penalizes you in all modules—incorrect spelling = zero marks in Listening/Reading', fix: 'Write new vocabulary out; use audio pronunciation guides' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.mistake}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.why}</TableCell>
                  <TableCell className="text-right text-primary text-xs sm:text-sm leading-relaxed">{row.fix}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'our-app-features',
    number: '8',
    title: 'How to Use Our App for Maximum Results',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Maximize your preparation efficiency by leveraging our built-in features systematically:
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Feature</TableHead>
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">How to Use It</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Why It Helps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { feat: 'Spaced Repetition Algorithm', use: 'Review cards daily; do not skip sessions', why: 'Guarantees 90%+ long-term retention' },
                  { feat: 'Audio Pronunciation', use: 'Listen and repeat aloud for each card', why: 'Builds muscle memory for Speaking test clarity' },
                  { feat: 'Context Sentences', use: 'Read the context aloud; construct your own sentences', why: 'Builds active vocabulary for Writing and Speaking' },
                  { feat: 'Topic Categories', use: 'Study one topic per week systematically', why: 'Covers high-frequency exam concepts' },
                  { feat: 'Difficulty Ratings', use: 'Rate honestly (Easy, Medium, Difficult)', why: 'Dynamically optimizes scheduling intervals' },
                ].map((row, idx) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.feat}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.use}</TableCell>
                    <TableCell className="text-right text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.why}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Sample Daily 25-Minute Workflow
          </h4>
          <ol className="list-decimal pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li><strong className="text-white">Min 0–5:</strong> Review today&apos;s scheduled card deck (algorithm-notified).</li>
            <li><strong className="text-white">Min 5–15:</strong> Learn 15 new vocabulary cards using native audio + context sentences.</li>
            <li><strong className="text-white">Min 15–20:</strong> Active retrieval: construct 5 original sentences using the new words.</li>
            <li><strong className="text-white">Min 20–25:</strong> Rate card difficulty honestly; check your weekly progress analytics.</li>
          </ol>
        </div>
      </div>
    ),
  },
  {
    id: 'disclaimer',
    number: '9',
    title: 'Disclaimer & Sources',
    content: (
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <p className="text-xs leading-relaxed text-zinc-500 font-sans">
          This study strategy guide is compiled based on official IELTS public marking criteria guidelines. For official details regarding test registrations and testing formats, visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
