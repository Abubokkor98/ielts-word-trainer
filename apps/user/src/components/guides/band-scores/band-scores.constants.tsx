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
    id: 'scale',
    number: '1',
    title: 'Understanding the 9-Band Scoring Scale',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          IELTS scores are reported on a 9-band scale from 0 to 9, with both whole bands and half bands (e.g., 6.5, 7.5). Every score corresponds to a specific level of English proficiency, allowing institutions worldwide to evaluate your language capabilities accurately.
        </p>
      </div>
    ),
  },
  {
    id: 'descriptors',
    number: '2',
    title: 'What Each Band Score Means',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Here is the official breakdown of the IELTS band descriptors, detailing the language competencies expected at each level:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                <TableHead className="w-[120px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Skill Level</TableHead>
                <TableHead className="w-[160px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Official Descriptor</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">What It Means</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '9', skill: 'Expert', descriptor: 'Expert user', meaning: 'Fully operational command of the language. Use is appropriate, accurate, and fluent with complete understanding.' },
                { band: '8', skill: 'Very Good', descriptor: 'Very good user', meaning: 'Fully operational command with only occasional unsystematic inaccuracies. Handles complex argumentation well.' },
                { band: '7', skill: 'Good', descriptor: 'Good user', meaning: 'Operational command with occasional inaccuracies, inappropriate usage, and misunderstandings. Generally handles complex language well.' },
                { band: '6', skill: 'Competent', descriptor: 'Competent user', meaning: 'Effective command despite some inaccuracies, inappropriate usage, and misunderstandings. Can use and understand reasonably complex language, particularly in familiar situations.' },
                { band: '5', skill: 'Modest', descriptor: 'Modest user', meaning: 'Partial command of the language, copes with overall meaning in most situations, though likely to make many mistakes. Should handle basic communication in their own field.' },
                { band: '4', skill: 'Limited', descriptor: 'Limited user', meaning: 'Basic competence limited to familiar situations. Frequently shows problems in understanding and expression.' },
                { band: '3', skill: 'Extremely Limited', descriptor: 'Extremely limited user', meaning: 'Conveys and understands only general meaning in very familiar situations. Frequent breakdowns in communication.' },
                { band: '2', skill: 'Intermittent', descriptor: 'Intermittent user', meaning: 'Great difficulty understanding spoken and written English.' },
                { band: '1', skill: 'Non-user', descriptor: 'Non-user', meaning: 'No ability to use the language except a few isolated words.' },
                { band: '0', skill: '—', descriptor: 'Did not attempt the test', meaning: 'Did not answer the questions.' },
              ].map((row, idx, arr) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.skill}</TableCell>
                  <TableCell className="text-zinc-300 font-medium text-xs sm:text-sm">{row.descriptor}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'calculation',
    number: '3',
    title: 'How the Overall Band Score is Calculated',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The overall band score is calculated by taking the mathematical average of your four section band scores (Listening, Reading, Writing, and Speaking), then rounding it to the nearest half or whole band score:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
          <li>If the average ends in <code className="px-1 py-0.5 rounded bg-zinc-800 font-mono text-zinc-200">.25</code>, it is rounded up to the next half band (e.g., 6.25 rounds up to 6.5).</li>
          <li>If the average ends in <code className="px-1 py-0.5 rounded bg-zinc-800 font-mono text-zinc-200">.75</code>, it is rounded up to the next whole band (e.g., 6.75 rounds up to 7.0).</li>
        </ul>

        <div className="overflow-x-auto my-6 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Listening</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Reading</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Writing</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Speaking</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Average</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Band Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { l: '6.5', r: '6.5', w: '5.0', s: '7.0', avg: '6.25', band: '6.5' },
                { l: '4.0', r: '3.5', w: '4.0', s: '4.0', avg: '3.875', band: '4.0' },
                { l: '6.5', r: '6.5', w: '5.5', s: '6.0', avg: '6.125', band: '6.0' },
              ].map((row, idx, arr) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.l}</TableCell>
                  <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.r}</TableCell>
                  <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.w}</TableCell>
                  <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.s}</TableCell>
                  <TableCell className="text-zinc-400 font-mono text-xs sm:text-sm">{row.avg}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'university',
    number: '4',
    title: 'Common Band Score Requirements for Universities',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Most universities worldwide require an IELTS score between 6.0 and 7.0 for academic admissions, though top-tier institutions require much higher proficiency bands:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/2 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Institution Type</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Typical Overall Band</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Minimum per Section</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { type: 'Undergraduate (most universities)', band: '6.0–6.5', section: '5.5–6.0' },
                { type: 'Postgraduate (most universities)', band: '6.5–7.0', section: '6.0–6.5' },
                { type: 'Top-tier universities (Oxford, Cambridge, Ivy League)', band: '7.0–7.5', section: '7.0' },
                { type: 'English language programs', band: '4.5–5.5', section: '4.5' },
              ].map((row, idx, arr) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-medium text-white text-xs sm:text-sm">{row.type}</TableCell>
                  <TableCell className="text-primary font-semibold text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="text-zinc-400 font-mono text-xs sm:text-sm">{row.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'immigration',
    number: '5',
    title: 'Common Band Score Requirements for Immigration',
    content: (
      <div className="space-y-8">
        {/* Canada Express Entry */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Canada Express Entry (CLB Levels)
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            For permanent residency through the Federal Skilled Worker Program (Express Entry), candidates must meet specific Canadian Language Benchmark (CLB) levels:
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">CLB Level</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Reading</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Writing</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Listening</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Speaking</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Points Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { clb: '10', r: '8.0', w: '7.5', l: '8.5', s: '7.5', points: 'Maximum points (34/32)' },
                  { clb: '9', r: '7.0', w: '7.0', l: '8.0', s: '7.0', points: 'High points' },
                  { clb: '8', r: '6.5', w: '6.5', l: '7.5', s: '6.5', points: 'Good points' },
                  { clb: '7', r: '6.0', w: '6.0', l: '6.0', s: '6.0', points: 'Minimum requirement' },
                  { clb: '6', r: '5.0', w: '5.5', l: '5.5', s: '5.5', points: 'Reduced points' },
                ].map((row, idx, arr) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-mono font-bold text-white text-xs sm:text-sm">CLB {row.clb}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.r}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.w}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.l}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.s}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm font-semibold text-primary">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Australia */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Australia Points System
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            For skilled migration visas (such as subclasses 189, 190, and 491), candidates score points depending on their evaluated English capabilities:
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">English Level</TableHead>
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">IELTS Score</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Points Awarded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { level: 'Competent English', score: '6.0 in all sections', points: 'Minimum requirement' },
                  { level: 'Proficient English', score: '7.0 in all sections', points: '+10 points' },
                  { level: 'Superior English', score: '8.0 in all sections', points: '+20 points' },
                ].map((row, idx, arr) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.level}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.score}</TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs sm:text-sm">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* UK */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            UK IELTS for UKVI
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            For UK visas, the minimum requirements are mapped according to the Common European Framework of Reference for Languages (CEFR):
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">CEFR Level</TableHead>
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Minimum IELTS Score</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Visa Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { cefr: 'B1', score: '4.0 in all four components', visa: 'Basic worker, some study visas' },
                  { cefr: 'B2', score: '5.5 in all four components', visa: 'Skilled worker, student visas' },
                  { cefr: 'C1', score: '7.0 in all four components', visa: 'Highly skilled, professional visas' },
                ].map((row, idx, arr) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-bold text-white text-xs sm:text-sm">CEFR {row.cefr}</TableCell>
                    <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.score}</TableCell>
                    <TableCell className="text-right text-zinc-400 text-xs sm:text-sm font-medium">{row.visa}</TableCell>
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
    id: 'tips',
    number: '6',
    title: 'Tips for Improving by 0.5 to 1.0 Band',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Reaching your target band requires strategic learning and consistent preparation. Here are research-backed tips to bump your score:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Take a diagnostic test:</strong> Identify your current baseline level and pin down weak focus areas.
          </li>
          <li>
            <strong className="text-white">Create a daily study routine:</strong> Work on your reading, listening, writing, and speaking skills systematically.
          </li>
          <li>
            <strong className="text-white">Focus heavily on vocabulary:</strong> Lexical Resource accounts for <strong className="text-primary font-semibold">25% of your marks</strong> in both Writing and Speaking!
          </li>
          <li>
            <strong className="text-white">Practice under real test conditions:</strong> Set timers, remove distractions, and get familiar with test formats.
          </li>
          <li>
            <strong className="text-white">Analyze mistakes rigorously:</strong> Do not just count your scores. Track why you got an answer wrong and learn the core patterns.
          </li>
          <li>
            <strong className="text-white">Work specifically on weak sections:</strong> Dedicate more practice hours to your lowest-scoring skill.
          </li>
          <li>
            <strong className="text-white">Learn the detailed band descriptors:</strong> Understand exactly what IELTS examiners look for in your target band.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'disclaimer',
    number: '7',
    title: 'Disclaimer & Sources',
    content: (
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <p className="text-xs leading-relaxed text-zinc-500 font-sans">
          This guide is compiled for educational and informational purposes only. While every attempt is made to verify the accuracy of this data against official scoring models, exact conversions can vary slightly between different test versions. For the most official, authoritative, and up-to-date guidance, please visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
