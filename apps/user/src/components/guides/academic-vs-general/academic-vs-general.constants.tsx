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
    id: 'target-audience',
    number: '1',
    title: 'Who Should Take Which Test?',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The first step in your IELTS journey is selecting the correct module. Choosing the wrong module can invalidate your application, so it is crucial to align your choice with your official goals:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Test Type</TableHead>
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Purpose</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Target Audience</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { type: 'IELTS Academic', purpose: 'University admission, professional registration (e.g., medical councils)', audience: 'Students pursuing higher education overseas, doctors, nurses, and pharmacists' },
                { type: 'IELTS General Training', purpose: 'Immigration, work experience, secondary education, or vocational training', audience: 'People moving to English-speaking countries (Canada, Australia, UK, New Zealand) for work or skilled migration' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.type}</TableCell>
                  <TableCell className="text-primary font-medium text-xs sm:text-sm">{row.purpose}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.audience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed pt-2">
          👉 Key Rule: Choose Academic for university admission and professional licenses; choose General Training for immigration and skilled work visas.
        </p>
      </div>
    ),
  },
  {
    id: 'reading-differences',
    number: '2',
    title: 'Differences in Reading Section',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          While both modules test your reading comprehension over 60 minutes with 40 questions, the source materials, vocabulary levels, and conversion scales differ substantially:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Reading</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">General Training Reading</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Content', acad: 'Academic passages sourced from journals, textbooks, magazines, and newspapers', gen: 'Everyday English sourced from notices, advertisements, company manuals, and workplace guidelines' },
                { aspect: 'Section 1', acad: 'N/A (Three long passages)', gen: '2-3 short factual texts about everyday life' },
                { aspect: 'Section 2', acad: 'N/A (Three long passages)', gen: '2 short work-related factual texts (e.g., job descriptions, training manuals)' },
                { aspect: 'Section 3', acad: '1 long academic text (complex)', gen: '1 longer, more complex academic-style or general interest text' },
                { aspect: 'Vocabulary', acad: 'More difficult, high-level academic vocabulary with abstract concepts', gen: 'Practical, everyday English and common workplace contexts' },
                { aspect: 'Score Conversion', acad: '30/40 correct answers ≈ Band 7.0', gen: '34-35/40 correct answers ≈ Band 7.0' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 5 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.acad}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.gen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold pt-2">
          ⚠️ Important: Because the texts in the General Training module are shorter and easier to digest, the grade boundary is higher—meaning you need more correct answers to achieve the same band score compared to Academic.
        </p>
      </div>
    ),
  },
  {
    id: 'writing-task-1',
    number: '3',
    title: 'Differences in Writing Task 1',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Writing Task 1 is completely different between the two modules. It tests your ability to adapt your vocabulary, tone, and descriptions depending on either academic data analysis or practical communication settings:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Task 1</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">General Training Task 1</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Task Type', acad: 'Describe visual data (graph, chart, table, diagram, or process flowchart) in objective language', gen: 'Write a letter based on a daily prompt (formal, semi-formal, or informal tone)' },
                { aspect: 'Focus', acad: 'Analyze trends, compare data points, describe changes over time, or explain how a process works', gen: 'Request information, explain a situation, complain about a service, or express personal/professional opinions' },
                { aspect: 'Word Count', acad: 'Minimum 150 words', gen: 'Minimum 150 words' },
                { aspect: 'Recommended Time', acad: '20 minutes', gen: '20 minutes' },
                { aspect: 'Skills Tested', acad: 'Data interpretation, factual description, grouping information, academic summaries', gen: 'Practical correspondence, tone adaptation, formatting structure, descriptive clarity' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.acad}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.gen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'writing-task-2',
    number: '4',
    title: 'Writing Task 2 (Same for Both)',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Writing Task 2 is highly similar across both versions. It is always a formal or semi-formal essay requiring you to structure a logical argument and provide relevant examples:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Task 2</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">General Training Task 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'Task Type', acad: 'Formal essay (minimum 250 words)', gen: 'Semi-formal or formal essay (minimum 250 words)' },
                { aspect: 'Topics', acad: 'Academic and broad societal issues (e.g., environment, technology, globalization, education)', gen: 'Everyday topics of common interest (e.g., family, work, transport, hobbies)' },
                { aspect: 'Marking Criteria', acad: 'Same 4 criteria: Task Response, Coherence/Cohesion, Lexical Resource, Grammatical Range/Accuracy', gen: 'Same 4 criteria: Task Response, Coherence/Cohesion, Lexical Resource, Grammatical Range/Accuracy' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 2 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.acad}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.gen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'similarities',
    number: '5',
    title: 'Similarities (Identical for Both Tests)',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          It is important to remember that large sections of the IELTS exam are completely identical, meaning your preparation for these sections will be the same regardless of which test you select:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Skill / Parameter</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Status & Wording</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { skill: 'Listening', status: 'Identical — same recordings, same question booklets, and same scoring conversions' },
                { skill: 'Speaking', status: 'Identical — same face-to-face format, same examiners, and same scoring criteria' },
                { skill: 'Test Duration', status: 'Same total core test time: 2 hours 44 minutes' },
                { skill: 'Band Scoring', status: 'Both report scores on the same 9-band scale (0 to 9)' },
                { skill: 'Validity Period', status: 'Scores remain valid for exactly 2 years from the test date' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.skill}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'countries',
    number: '6',
    title: 'Countries & Institutions Accepting Each Format',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Universities and immigration authorities have strict rules regarding which formats they accept for admissions and visas:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Country / Region</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-center">Academic Accepted</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-center">General Training Accepted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { country: 'UK Universities', acad: '✓ Primary requirement (Undergraduate & Postgraduate)', gen: 'Limited (Accepted for some vocational programs only)' },
                { country: 'USA Universities', acad: '✓ Primary requirement (Over 3,400 institutions accept IELTS)', gen: '✗ Generally not accepted for degree admissions' },
                { country: 'Canada (Admissions & Visa)', acad: '✓ Primary requirement for universities / SDS Study Visas', gen: '✓ Standard requirement for Express Entry (PR skilled migration)' },
                { country: 'Australia (Admissions & Visa)', acad: '✓ Primary requirement for university admissions', gen: '✓ Standard requirement for skilled worker and points visas' },
                { country: 'New Zealand (Admissions & Visa)', acad: '✓ Primary requirement for university admissions', gen: '✓ Standard requirement for immigration and residence visas' },
                { country: 'Professional Bodies', acad: '✓ Required for medical, nursing, law, and engineering licenses', gen: 'Limited (Accepted for some trade certifications)' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 5 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.country}</TableCell>
                  <TableCell className="text-primary font-medium text-xs sm:text-sm text-center">{row.acad}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm leading-relaxed text-center">{row.gen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'scoring-differences',
    number: '7',
    title: 'Scoring Differences & Conversions',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          While Listening and Speaking scores convert identically, the <strong className="text-white">Reading section</strong> has separate conversion tables. You need more correct answers out of 40 in General Training Reading because the texts contain less complex vocabulary and are shorter:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Academic Reading (correct / 40)</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">General Training Reading (correct / 40)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '9.0', acad: '39 - 40', gen: '40' },
                { band: '8.0', acad: '35 - 36', gen: '38' },
                { band: '7.0', acad: '30 - 32', gen: '34 - 35' },
                { band: '6.0', acad: '23 - 26', gen: '30 - 31' },
                { band: '5.0', acad: '15 - 18', gen: '23 - 26' },
                { band: '4.0', acad: '10 - 12', gen: '15 - 18' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 5 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
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
    id: 'disclaimer',
    number: '8',
    title: 'Disclaimer & Sources',
    content: (
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <p className="text-xs leading-relaxed text-zinc-500 font-sans">
          This guide is compiled for educational and informational purposes only. While every attempt is made to verify the accuracy of this data against official test criteria, candidates should confirm their requirements directly with their prospective university, employer, or immigration portal. For official details, please visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
