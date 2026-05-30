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
    id: 'raw-scores',
    number: '1',
    title: 'How Raw Scores Convert to Band Scores',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Both the IELTS Listening and Reading sections consist of exactly <strong className="text-white">40 questions</strong>. For every question you answer correctly, you are awarded 1 mark (known as a raw score). Your raw score out of 40 is then converted into the official IELTS 9-band scale.
        </p>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed">
          👉 No Negative Marking: You will not lose points for incorrect answers. Your score is based solely on the total number of correct answers. Never leave a question blank on the test sheet!
        </p>
      </div>
    ),
  },
  {
    id: 'listening-scoring',
    number: '2',
    title: 'Listening Score Conversion',
    content: (
      <div className="space-y-6">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The Listening section uses the exact same conversion model for both Academic and General Training modules, as the recordings and booklets are identical:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/2 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Raw Score (correct / 40)</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Band Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { raw: '39 - 40', band: '9.0' },
                { raw: '37 - 38', band: '8.5' },
                { raw: '35 - 36', band: '8.0' },
                { raw: '33 - 34', band: '7.5' },
                { raw: '30 - 32', band: '7.0' },
                { raw: '29', band: '6.5' },
                { raw: '23 - 26', band: '6.0' },
                { raw: '19 - 22', band: '5.5' },
                { raw: '16 - 18', band: '5.0' },
                { raw: '13 - 15', band: '4.5' },
                { raw: '10 - 12', band: '4.0' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 10 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.raw}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Approximate conversions at key bands
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { raw: '35/40', band: 'Band 8.0' },
              { raw: '30/40', band: 'Band 7.0' },
              { raw: '23/40', band: 'Band 6.0' },
              { raw: '16/40', band: 'Band 5.0' }
            ].map((keyItem) => (
              <div
                key={keyItem.band}
                className="p-4 rounded-xl border border-[var(--rb-border-subtle)] bg-zinc-900/10 text-center flex flex-col justify-center items-center"
              >
                <span className="font-mono text-base font-bold text-primary">{keyItem.raw}</span>
                <span className="text-xs text-zinc-400 font-sans mt-1">{keyItem.band}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'reading-scoring',
    number: '3',
    title: 'Reading Score Conversion',
    content: (
      <div className="space-y-6">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The Reading section grade boundaries differ significantly between modules because General Training contains shorter texts written in everyday English, while Academic contains longer, complex passages:
        </p>

        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band Score</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Reading (correct / 40)</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">General Training Reading (correct / 40)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '9.0', acad: '39 - 40', gen: '40' },
                { band: '8.5', acad: '37 - 38', gen: '39' },
                { band: '8.0', acad: '35 - 36', gen: '38' },
                { band: '7.5', acad: '33 - 34', gen: '36 - 37' },
                { band: '7.0', acad: '30 - 32', gen: '34 - 35' },
                { band: '6.5', acad: '29', gen: '32 - 33' },
                { band: '6.0', acad: '23 - 26', gen: '30 - 31' },
                { band: '5.5', acad: '19 - 22', gen: '27 - 29' },
                { band: '5.0', acad: '15 - 18', gen: '23 - 26' },
                { band: '4.5', acad: 'N/A', gen: '19 - 22' },
                { band: '4.0', acad: 'N/A', gen: '15 - 18' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 10 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="text-zinc-300 font-mono text-xs sm:text-sm">{row.acad}</TableCell>
                  <TableCell className="text-right text-zinc-400 font-mono text-xs sm:text-sm">{row.gen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'important-notes',
    number: '4',
    title: 'Important Score Parameters',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Keep these important notes and parameters in mind when practicing and checking your practice test conversions:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Exact conversions vary', detail: 'The precise number of correct answers needed for each band varies slightly from test version to test version to keep evaluations fair across test difficulty levels.' },
                { aspect: 'Academic is harder', detail: 'Academic Reading contains more complex academic journals and abstract vocabulary, which is why it requires fewer correct answers for a given band.' },
                { aspect: 'More answers needed', detail: 'On General Training Reading, you must secure more correct answers to gain a specific band score due to the everyday nature of the texts.' },
                { aspect: 'No negative marking', detail: 'Every correct answer counts. There is absolutely no penalty or negative score impact for a wrong answer.' },
                { aspect: 'Whole and half bands', detail: 'All IELTS component and overall scores are reported as whole or half bands (e.g., 6.0, 6.5, 7.0).' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'tips-maximizing',
    number: '5',
    title: 'Tips for Maximizing Correct Answers',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Unlock higher raw scores with these strategic guidelines during practice:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Answer every single question:</strong> Since there is no negative marking, never leave a bubble blank. Guess if you are unsure!
          </li>
          <li>
            <strong className="text-white">Practice skimming and scanning:</strong> Learn to locate key details quickly. You only have 60 minutes for 3 long Reading passages!
          </li>
          <li>
            <strong className="text-white">Watch spelling closely:</strong> In both Listening and Reading completion tasks, incorrect spelling = zero marks for that question.
          </li>
          <li>
            <strong className="text-white">Follow word limits strictly:</strong> If the instruction says <code className="px-1 py-0.5 rounded bg-zinc-800 font-mono text-xs">NO MORE THAN TWO WORDS</code>, writing three words results in an automatic wrong answer, even if the information is correct.
          </li>
          <li>
            <strong className="text-white">Transfer answers carefully:</strong> In the paper test, you get 10 minutes to copy answers to the sheet. Double-check your numbers! In the computer test, you only get 2 minutes to check inputs.
          </li>
          <li>
            <strong className="text-white">Familiarize yourself with all question types:</strong> Master multiple choice, matching diagrams, map labeling, and True/False/Not Given structures.
          </li>
          <li>
            <strong className="text-white">Manage time strategically:</strong> Do not spend more than 1.5 minutes on any single question. Move on and return to it if time permits.
          </li>
        </ul>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed pt-2">
          💡 Key Strategy: For Reading, spend exactly ~20 minutes per passage. For Listening, stay highly focused during the audio playback—remember, you will hear the recording only once!
        </p>
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
          This guide is compiled for educational and informational purposes only. While every attempt is made to verify these raw-to-band conversions against current test guidelines, conversions fluctuate slightly between test sheets depending on calculated difficulty. For official details, please visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
