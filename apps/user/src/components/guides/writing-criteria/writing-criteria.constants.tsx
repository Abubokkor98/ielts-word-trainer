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
    id: 'marking-criteria-overview',
    number: '1',
    title: '4 Criteria Used by IELTS Examiners',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          IELTS examiners evaluate your writing tasks against four core assessment criteria. Each of these criteria carries equal weighting (<strong className="text-white">25%</strong>) in determining your band score for each task. Note that while both tasks use the same criteria, <strong className="text-primary font-semibold">Task 2 carries twice as much weight</strong> as Task 1 in calculating your overall Writing band score.
        </p>

        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Criterion</TableHead>
                <TableHead className="w-1/6 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Weight</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Task 1 Name</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Task 2 Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { criterion: 'Content Fulfillment', weight: '25%', t1: 'Task Achievement', t2: 'Task Response' },
                { criterion: 'Organization & Flow', weight: '25%', t1: 'Coherence and Cohesion', t2: 'Coherence and Cohesion' },
                { criterion: 'Vocabulary Range', weight: '25%', t1: 'Lexical Resource', t2: 'Lexical Resource' },
                { criterion: 'Grammatical Accuracy', weight: '25%', t1: 'Grammatical Range and Accuracy', t2: 'Grammatical Range and Accuracy' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.criterion}</TableCell>
                  <TableCell className="text-primary font-mono text-xs sm:text-sm font-semibold">{row.weight}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">{row.t1}</TableCell>
                  <TableCell className="text-right text-zinc-400 text-xs sm:text-sm font-medium">{row.t2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'task-achievement-response',
    number: '2',
    title: 'Task Achievement / Task Response',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
          What it means: How well you understood and completely fulfilled the requirements of the prompt.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          For Task 1, this evaluates your ability to report on visual information, identify key trends, and provide a clear overview. For Task 2, it evaluates your ability to present a clear position, respond to all parts of the prompt, and develop your ideas with relevant support:
        </p>

        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                <TableHead className="w-1/2 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Task Achievement (Task 1)</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Task Response (Task 2)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '8', t1: 'Sufficiently covers all requirements; key features are well described; clear overview presented with logical detail', t2: 'Fully addresses all parts of the prompt; presents a well-developed position with relevant, extended, and supported ideas' },
                { band: '7', t1: 'Covers all requirements; some key features may be missed or overemphasized; presents a clear overview with logical comparison', t2: 'Addresses all parts of the task; position is clearly presented throughout; presents relevant main ideas, though some may be underdeveloped' },
                { band: '6', t1: 'Covers the requirements; may miss or inaccurately report some key features; overview may be unclear or lack detailed context', t2: 'Addresses the task; position is presented, though ideas may be repetitive or lack details; relevant main ideas are present but underdeveloped' },
                { band: '5', t1: 'Handles task inadequately; format may be inappropriate; key features unclear, missing, or inaccurate; no clear overview is present', t2: 'Addresses the task only partially; position is unclear or inconsistent; main ideas are limited, underdeveloped, or unsupported' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.t1}</TableCell>
                  <TableCell className="text-right text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.t2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed pt-2">
          💡 Expert Tip: For Task 1, always include an objective summary paragraph (the &ldquo;Overview&rdquo;). For Task 2, make sure you answer all questions asked in the prompt, or your Task Response score will be capped at a Band 5.
        </p>
      </div>
    ),
  },
  {
    id: 'coherence-cohesion',
    number: '3',
    title: 'Coherence and Cohesion',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
          What it means: Paragraph structure, linking words, logical progression of ideas.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Coherence refers to the logical connection and structure of your ideas. Cohesion refers to the mechanics of connecting sentences, lists, and paragraphs with appropriate linking phrases (cohesive devices):
        </p>

        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description of Organisation & Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '8', desc: 'Sequences information and ideas logically; paragraphing is skillful and logical; uses a wide range of cohesive devices appropriately with rare minor issues' },
                { band: '7', desc: 'Logically organizes information; clear progression throughout the essay; uses a range of cohesive devices appropriately (though some may be mechanical)' },
                { band: '6', desc: 'Arranges information coherently; clear overall progression present; uses cohesive devices appropriately, though they may be repetitive or occasionally faulty' },
                { band: '5', desc: 'Arranges information poorly; may lack overall progression; limited or inaccurate cohesive devices; paragraphing may be overused, misused, or missing' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Key Cohesive Devices to Learn
          </h4>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              'However', 'Therefore', 'Moreover', 'Furthermore', 'In addition',
              'Consequently', 'Nevertheless', 'On the other hand', 'First/Second/Third', 'In conclusion'
            ].map((device) => (
              <span
                key={device}
                className="px-2.5 py-1 rounded bg-zinc-800 border border-[var(--rb-border-subtle)] font-mono text-xs text-zinc-300"
              >
                {device}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'lexical-resource',
    number: '4',
    title: 'Lexical Resource (Vocabulary)',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
            What it means: Vocabulary range, precision, collocations, spelling, and word formation.
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Lexical Resource measures how wide your vocabulary is and how accurately you can select the correct words in the correct contexts:
          </p>

          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description of Vocabulary Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { band: '8', desc: 'Uses a wide vocabulary resource; rarely selects words wrongly; skillful use of less common and idiomatic items with rare minor errors in word choice/spelling' },
                  { band: '7', desc: 'Uses a sufficient vocabulary for long, complex turns; uses less common and idiomatic items; shows awareness of style and collocation; occasional errors in word choice' },
                  { band: '6', desc: 'Uses a sufficient vocabulary for the task; attempts to use less common items with some awareness of style and collocation; some errors in word choice/spelling' },
                  { band: '5', desc: 'Uses an adequate vocabulary for familiar topics; limited or repetitive use of less common vocabulary; noticeable errors in word choice, spelling, and word formation' },
                ].map((row, idx) => (
                  <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* How our app helps */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            How Our App Helps
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Our vocabulary platform specifically targets the IELTS Lexical Resource requirements by providing:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
            <li>
              <strong className="text-white">Topic-specific vocabulary lists:</strong> Target high-scoring IELTS domains (Environment, Education, Technology, Health) to help you stand out.
            </li>
            <li>
              <strong className="text-white">Common collocations:</strong> Learn phrases exactly as native speakers write them (e.g., <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-primary font-mono text-xs">mitigate climate change</code> instead of <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-xs">stop climate change</code>).
            </li>
            <li>
              <strong className="text-white">Less common / idiomatic expressions:</strong> Seamlessly integrate higher-level structures to unlock Band 7+ criteria.
            </li>
            <li>
              <strong className="text-white">Word formation techniques:</strong> Master prefixes and suffixes to accurately adapt word forms.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'grammatical-range-accuracy',
    number: '5',
    title: 'Grammatical Range and Accuracy',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
          What it means: Sentence variety (simple vs complex structures), error frequency, punctuation.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Grammatical Range evaluates the variety of structures you attempt (such as passive voice, conditional structures, and relative clauses). Accuracy measures how many of your sentences are completely error-free:
        </p>

        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description of Grammatical Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { band: '8', desc: 'Uses a wide range of structures; majority of sentences are error-free; makes only very occasional, minor, or systematic errors' },
                { band: '7', desc: 'Uses a variety of complex structures; frequent error-free sentences; has good control over grammar and punctuation despite some minor errors' },
                { band: '6', desc: 'Uses a mix of simple and complex sentence forms; makes some errors in grammar and punctuation, but they do not impede communication' },
                { band: '5', desc: 'Uses only a limited range of structures; attempts complex sentences but they are less accurate; grammatical/punctuation errors may impede communication' },
              ].map((row, idx) => (
                <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === 3 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    ),
  },
  {
    id: 'task-differences',
    number: '6',
    title: 'Differences Between Task 1 and Task 2 Assessment',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          While evaluated on the same 4 core parameters, the practical application, length, and scoring weight differ completely between the two tasks:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Aspect</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Writing Task 1</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Writing Task 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { aspect: 'First Criterion Name', t1: 'Task Achievement', t2: 'Task Response' },
                { aspect: 'Word Count', t1: '150 words minimum', t2: '250 words minimum' },
                { aspect: 'Weighting', t1: 'Less weight (approx. 1/3 of writing score)', t2: 'More weight (approx. 2/3 of writing score)' },
                { aspect: 'Recommended Time', t1: '20 minutes', t2: '40 minutes' },
                { aspect: 'Focus', t1: 'Data accuracy, overview paragraph, reporting key features', t2: 'Position development, argument progression, detailed examples' },
              ].map((row, idx) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === 4 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.aspect}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">{row.t1}</TableCell>
                  <TableCell className="text-right text-zinc-400 text-xs sm:text-sm leading-relaxed">{row.t2}</TableCell>
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
    number: '7',
    title: 'Disclaimer & Sources',
    content: (
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <p className="text-xs leading-relaxed text-zinc-500 font-sans">
          This guide is compiled for educational and informational purposes only. It is styled based on official IELTS writing band descriptors published for public review. For authoritative, fully detailed, and up-to-date band descriptor PDFs, please visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
