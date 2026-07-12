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
    id: 'overview',
    number: '1',
    title: 'What Is the Complete IELTS Test Structure?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The International English Language Testing System (IELTS) evaluates all four core language skills: <strong className="text-white">Listening</strong>, <strong className="text-white">Reading</strong>, <strong className="text-white">Writing</strong>, and <strong className="text-white">Speaking</strong>. Whether you take the Academic or General Training version, you will complete these four components to receive an overall proficiency band score.
        </p>
      </div>
    ),
  },
  {
    id: 'listening',
    number: '2',
    title: 'Listening (30 minutes + transfer time)',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The IELTS Listening section measures your ability to understand main ideas, specific factual information, opinions, and attitudes of speakers. The content is identical for both Academic and General Training modules.
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Duration', details: '30 minutes + 10 minutes transfer time (paper-based)' },
                { aspect: 'Sections', details: '4 sections with 10 questions each = 40 questions total' },
                { aspect: 'Content', details: '4 recordings of native English speakers (monologues and conversations)' },
                { aspect: 'Question Types', details: 'Multiple choice, matching, plan/map/diagram labeling, form/note/table/flow-chart/summary completion, sentence completion' },
                { aspect: 'Transfer Time', details: 'Paper-based: 10 minutes to transfer answers to the answer sheet. Computer-delivered: 2 minutes to check answers.' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
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
    id: 'reading',
    number: '3',
    title: 'Reading (60 minutes)',
    content: (
      <div className="space-y-6">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The IELTS Reading section consists of 40 questions designed to test a wide range of reading skills. These include reading for gist, reading for main ideas, reading for detail, understanding logical argument, and recognizing writers&apos; opinions, attitudes, and purpose.
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Duration', details: '60 minutes (no extra transfer time allowed)' },
                { aspect: 'Passages', details: '3 long passages with varying levels of difficulty' },
                { aspect: 'Questions', details: '40 questions total (typically 13-14 per passage)' },
                { aspect: 'Question Types', details: 'Multiple choice, identifying information/opinion (True/False/Not Given), matching headings/features, sentence/summary/note/table/flow-chart completion, short answer' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Academic vs General Reading Differences */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Academic vs General Reading Differences
          </h4>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Reading</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">General Training Reading</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { aspect: 'Section 1', acad: 'N/A (Three long passages of general interest)', gen: '2-3 short factual texts about everyday life' },
                  { aspect: 'Section 2', acad: 'N/A (Three long passages of general interest)', gen: '2 short work-related factual texts' },
                  { aspect: 'Section 3', acad: '1 long academic text (Total 3 long passages)', gen: '1 longer, more complex academic-style text' },
                  { aspect: 'Difficulty', acad: 'More difficult academic vocabulary, greater textual complexity', gen: 'Everyday English, workplace contexts' },
                ].map((row, idx) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.acad}</TableCell>
                    <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.gen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'writing',
    number: '4',
    title: 'Writing (60 minutes)',
    content: (
      <div className="space-y-6">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The IELTS Writing section evaluates your ability to write a response appropriate for university or daily environments, organize ideas, and use a wide range of vocabulary and grammar accurately.
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Duration', details: '60 minutes (no breaks between tasks)' },
                { aspect: 'Task 1', details: '20 minutes recommended, minimum 150 words' },
                { aspect: 'Task 2', details: '40 minutes recommended, minimum 250 words' },
                { aspect: 'Weighting', details: 'Task 2 carries twice as much weight as Task 1 toward your writing score' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Academic vs General Writing Differences */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Academic vs General Writing Differences
          </h4>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Writing</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">General Training Writing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { aspect: 'Task 1', acad: 'Describe a graph, chart, table, process map, or diagram in objective language (150+ words)', gen: 'Write a letter based on a daily scenario (formal, semi-formal, or informal) (150+ words)' },
                  { aspect: 'Task 2', acad: 'Write a formal essay (250+ words) responding to a specific point of view, argument, or academic topic', gen: 'Write a semi-formal or formal essay (250+ words) on an everyday topic of common interest' },
                ].map((row, idx) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.acad}</TableCell>
                    <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.gen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'speaking',
    number: '5',
    title: 'Speaking (11-14 minutes)',
    content: (
      <div className="space-y-6">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The IELTS Speaking section is a face-to-face interactive interview with a certified examiner. It measures your fluency, coherence, pronunciation, grammatical range, and vocabulary precision (Lexical Resource).
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Duration', details: '11–14 minutes' },
                { aspect: 'Format', details: 'Face-to-face interview with a certified human examiner' },
                { aspect: 'Recording', details: 'The test is recorded for evaluation and review purposes' },
                { aspect: 'Same for', details: 'Both Academic and General Training modules utilize the exact same format and scoring' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Part Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Speaking Part Breakdown
          </h4>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Part</TableHead>
                  <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Duration</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { part: 'Part 1: Introduction', duration: '4–5 minutes', content: 'Warm-up questions about yourself, family, home, work, studies, interests, and other familiar topics.' },
                  { part: 'Part 2: Long Turn', duration: '3 minutes (1 min prep + 2 min speak)', content: 'You will receive a task card with a specific topic. You get 1 minute to prepare notes and must speak for up to 2 minutes on the topic.' },
                  { part: 'Part 3: Discussion', duration: '4–5 minutes', content: 'Deeper, abstract discussion with the examiner related to the topic of Part 2, evaluating your argumentation skills.' },
                ].map((row, idx) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 2 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.part}</TableCell>
                    <TableCell className="text-primary font-mono text-xs sm:text-sm">{row.duration}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'comparison',
    number: '6',
    title: 'What Are the Differences Between Paper-Based and Computer-Delivered IELTS?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          You can choose to take the IELTS test on paper or on a desktop computer. The test content, scoring, and speaking module remain identical, but the formats differ in specific features:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Paper-Based</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Computer-Delivered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Test Format', paper: 'Black ballpoint pen/pencil on paper booklets', computer: 'Desktop computer with standard keyboard' },
                { aspect: 'Listening', paper: 'Answers written on booklet, then transferred to answer sheet', computer: 'Answers inputted directly on computer with individual headphones' },
                { aspect: 'Reading', paper: 'Question booklet + paper answer sheet', computer: 'Texts and questions displayed side-by-side on screen' },
                { aspect: 'Writing', paper: 'Handwritten on paper answer booklets', computer: 'Typed on computer (includes word count display)' },
                { aspect: 'Speaking', paper: 'Face-to-face with examiner', computer: 'Face-to-face with examiner (some locations may utilize secure video calls)' },
                { aspect: 'Results', paper: '13 days after the test date', computer: '1–3 days after the test date' },
                { aspect: 'Test Availability', paper: 'Up to 48 test dates per year (usually Thursday/Saturday)', computer: 'Up to 3 sessions per day, 7 days per week' },
                { aspect: 'Time Display', paper: 'Wall clock in the test room (no personal watches)', computer: 'On-screen visual timer displaying remaining minutes' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 7 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.paper}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.computer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'duration-order',
    number: '7',
    title: 'How Long Is the IELTS Test and What Is the Order?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The core test modules (Listening, Reading, and Writing) are completed back-to-back in a single test session with no breaks. The Speaking module may be scheduled on the same day or within 7 days before or after the main test:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Component</TableHead>
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Duration</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { component: 'Listening', duration: '30 minutes + 10 minutes transfer time (paper)', order: '1st' },
                { component: 'Reading', duration: '60 minutes', order: '2nd' },
                { component: 'Writing', duration: '60 minutes', order: '3rd' },
                { component: 'Speaking', duration: '11–14 minutes', order: 'Same day or ± 7 days' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.component}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm font-mono">{row.duration}</TableCell>
                  <TableCell className="text-right text-primary font-bold text-xs sm:text-sm">{row.order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
          Total Core Test Time: 2 hours 40 minutes (Listening + Reading + Writing) + Speaking
        </p>
      </div>
    ),
  },
  {
    id: 'disclaimer',
    number: '8',
    title: 'Disclaimer & Sources',
    content: (
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <p className="text-xs leading-relaxed text-zinc-500 font-sans">
          This guide is compiled for educational and informational purposes only. While every attempt is made to verify the accuracy of this data against official test formats, exact specifications and availability can vary depending on your test center and region. For the most official, authoritative, and up-to-date guidance, please visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
