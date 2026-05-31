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
    title: '4 Criteria Used by IELTS Examiners',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The IELTS Speaking test evaluates your oral English proficiency across four core assessment parameters. Each parameter carries equal weighting (<strong className="text-white">25%</strong>) in determining your final score. The same band descriptors and assessment rules apply to both Academic and General Training modules.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
          Overall Speaking Score: The average of the four criteria, rounded to the nearest half (0.5) or whole band.
        </p>
      </div>
    ),
  },
  {
    id: 'fluency-coherence',
    number: '2',
    title: 'Fluency and Coherence',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
            What it means: How smoothly you speak, the speed/tempo of speech, logical progression of thoughts, and the ability to keep talking without excessive or unnatural hesitation.
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description of Fluency & Coherence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { band: '8', desc: 'Speaks at length fluently and effortlessly; only occasional repetition or self-correction; hesitation is minimal and content-related; coherence is easy to follow with logical progression' },
                  { band: '7', desc: 'Speaks at length with some repetition or self-correction; hesitation is usually content-related rather than searching for vocabulary/grammar; coherence is generally logical' },
                  { band: '6', desc: 'Willing to speak at length; may lose coherence due to occasional hesitation, repetition, or self-correction; uses a range of discourse markers though sometimes inappropriately' },
                  { band: '5', desc: 'Maintains flow but may lose coherence due to frequent language-related hesitation; overuses specific discourse markers; speaks mostly in simple, short sentence structures' },
                ].map((row, idx, arr) => (
                  <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Common Mistakes & Flow Indicators
          </h4>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Flow Characteristics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { band: 'Band 5', desc: 'Long pauses, searching for vocabulary, overusing fillers (um, uh, like) to stay active' },
                  { band: 'Band 6', desc: 'Content-related hesitation (thinking of what to say next), some visible self-correction' },
                  { band: 'Band 7', desc: 'Occasional repetition of phrases, mostly smooth transitions between different arguments' },
                  { band: 'Band 8', desc: 'Effortless and natural fluency, minimal language search, near-native discourse markers' },
                ].map((row, idx, arr) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.band}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
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
    id: 'lexical-resource',
    number: '3',
    title: 'Lexical Resource (Vocabulary Usage)',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
            What it means: Vocabulary range, ability to use less common words, precise context selection, idiomatic language, and paraphrasing effectively when stuck.
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description of Vocabulary Range</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { band: '8', desc: 'Uses a wide vocabulary range; rarely selects words wrongly; uses less common and idiomatic items skillfully with minor inaccuracies in collocations' },
                  { band: '7', desc: 'Sufficient vocabulary for unfamiliar topics; uses less common and idiomatic items; shows awareness of style and collocation; occasional errors' },
                  { band: '6', desc: 'Adequate vocabulary for the task; uses some less common items; attempts to use idiomatic language and collocations but with noticeable inaccuracies' },
                  { band: '5', desc: 'Adequate for familiar and simple topics; limited vocabulary range; frequent errors in word choice; needs repetition or rephrasing for clarity' },
                ].map((row, idx, arr) => (
                  <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
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
            Our vocabulary platform directly supports your IELTS Speaking Lexical Resource scores by delivering:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
            <li>
              <strong className="text-white">Topic-specific vocabulary:</strong> Target common Part 1 & Part 2 speaking themes (family, hobbies, home, work, culture).
            </li>
            <li>
              <strong className="text-white">Idiomatic expressions:</strong> Seamlessly integrate natural-sounding idioms (e.g., <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-primary font-mono text-xs">once in a blue moon</code>, <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-primary font-mono text-xs">over the moon</code>).
            </li>
            <li>
              <strong className="text-white">Paraphrasing templates:</strong> Learn synonyms to avoid repeating words examiners use in questions.
            </li>
            <li>
              <strong className="text-white">Natural collocations:</strong> Master phrases that flow organically in spoken English.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'grammatical-range',
    number: '4',
    title: 'Grammatical Range and Accuracy',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
            What it means: Variety of sentence structures attempted (simple, compound, and complex), error frequency, and the correct use of tenses.
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
                  { band: '8', desc: 'Uses a wide range of structures; majority of sentences are completely error-free; makes only very occasional or minor systematic errors' },
                  { band: '7', desc: 'Uses a variety of complex structures; frequent error-free sentences; has good control over grammar despite some minor, repetitive errors' },
                  { band: '6', desc: 'Uses a mix of simple and complex sentence forms; makes some errors in grammar, but they do not impede or block communication' },
                  { band: '5', desc: 'Uses only a limited range of simple structures; attempts complex sentences but they are often inaccurate; grammatical errors impede communication' },
                ].map((row, idx, arr) => (
                  <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Common Mistakes & Structural Indicators
          </h4>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Grammar Characteristics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { band: 'Band 5', desc: 'Relies mostly on simple sentences; frequent tense errors (e.g., mixing past and present)' },
                  { band: 'Band 6', desc: 'Attempts complex sentences but with noticeable errors; inconsistent tense use' },
                  { band: 'Band 7', desc: 'Good variety of structures with mostly accurate tenses and clauses' },
                  { band: 'Band 8', desc: 'Wide range of advanced structures (conditionals, passive) with rare, unsystematic errors' },
                ].map((row, idx, arr) => (
                  <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.band}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
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
    id: 'pronunciation',
    number: '5',
    title: 'Pronunciation',
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-semibold">
            What it means: Individual sounds, word stress, sentence stress, intonation, rhythm, and overall clarity.
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description of Pronunciation Clarity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { band: '8', desc: 'Easy to understand throughout; uses a wide range of pronunciation features successfully; native-like features with minor accent traces; listener understanding never affected' },
                  { band: '7', desc: 'Easy to understand throughout; uses some pronunciation features successfully (connected speech, intonation); L1 accent has minimal effect on clarity' },
                  { band: '6', desc: 'Generally easy to understand; uses some pronunciation features appropriately; L1 accent may cause occasional effort for the listener' },
                  { band: '5', desc: 'Some parts of speech are hard to understand; limited use of pronunciation features; L1 accent causes frequent listener effort' },
                ].map((row, idx, arr) => (
                  <TableRow key={row.band} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                    <TableCell className="font-mono font-bold text-primary text-xs sm:text-sm">{row.band}</TableCell>
                    <TableCell className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{row.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white tracking-wide border-l-2 border-primary pl-2 uppercase font-mono">
            Key Pronunciation Features to Master
          </h4>
          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
            <li>
              <strong className="text-white">Individual sounds:</strong> Vowel and consonant accuracy (e.g., /θ/ in &ldquo;think&rdquo;, /r/ vs /l/ distinctions).
            </li>
            <li>
              <strong className="text-white">Word stress:</strong> Syllable emphasis (e.g., <code className="px-1 py-0.5 rounded bg-zinc-800 font-mono text-xs">PHOtograph</code> vs <code className="px-1 py-0.5 rounded bg-zinc-800 font-mono text-xs">phoTOGraphy</code>).
            </li>
            <li>
              <strong className="text-white">Sentence stress:</strong> Emphasizing critical keywords in a sentence to convey semantic meaning.
            </li>
            <li>
              <strong className="text-white">Intonation:</strong> Rising and falling pitch to express statements, questions, or checklists naturally.
            </li>
            <li>
              <strong className="text-white">Rhythm & Connected Speech:</strong> Smoothly blending words together (e.g., saying &ldquo;wanna&rdquo; or &ldquo;going-to&rdquo; with natural rhythm rather than choppy pauses).
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'summary-table',
    number: '6',
    title: 'Band Descriptor Summary Table',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Here is a high-level visual summary of the Speaking marking criteria boundaries across bands 5 to 8:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/6 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Criterion</TableHead>
                <TableHead className="w-[60px] text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Weight</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band 5</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band 6</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Band 7</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider text-right">Band 8</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { criterion: 'Fluency & Coherence', weight: '25%', b5: 'Short sentences, frequent hesitation', b6: 'May lose coherence due to language search', b7: 'Speaks at length, some self-correction', b8: 'Effortless flow, logical coherence' },
                { criterion: 'Lexical Resource', weight: '25%', b5: 'Limited vocabulary, word choice errors', b6: 'Adequate for task, attempts idioms', b7: 'Less common/idiomatic items skillfully', b8: 'Wide range, precise selections' },
                { criterion: 'Grammar', weight: '25%', b5: 'Limited structures, frequent errors', b6: 'Mix of simple/complex, some errors', b7: 'Complex structures, frequent error-free', b8: 'Wide range of structures, mostly error-free' },
                { criterion: 'Pronunciation', weight: '25%', b5: 'Hard to understand, accent causes effort', b6: 'Generally clear, L1 accent occasional effort', b7: 'Easy to understand, good features', b8: 'Easy throughout, native-like accent traces' },
              ].map((row, idx, arr) => (
                <TableRow key={idx} className={`hover:bg-zinc-800/20 ${idx === arr.length - 1 ? 'border-none' : 'border-[var(--rb-border-subtle)]'}`}>
                  <TableCell className="font-semibold text-white text-xs sm:text-sm">{row.criterion}</TableCell>
                  <TableCell className="text-primary font-mono text-xs sm:text-sm font-semibold">{row.weight}</TableCell>
                  <TableCell className="text-zinc-400 text-xs sm:text-sm">{row.b5}</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">{row.b6}</TableCell>
                  <TableCell className="text-zinc-200 text-xs sm:text-sm">{row.b7}</TableCell>
                  <TableCell className="text-right text-primary font-semibold text-xs sm:text-sm">{row.b8}</TableCell>
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
          This guide is compiled for educational and informational purposes only. It is styled based on official IELTS speaking band descriptors published for public review. For authoritative, fully detailed, and up-to-date band descriptor PDFs, please visit <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-primary transition-colors underline underline-offset-2">ielts.org</a>.
        </p>
        <p className="text-[11px] leading-relaxed text-zinc-600 font-sans">
          * IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, or connected to any of these official organizations.
        </p>
      </div>
    ),
  },
];
