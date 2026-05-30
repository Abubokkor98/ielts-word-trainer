import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';
import type { ReactNode } from 'react';

export interface PrivacySectionData {
  readonly id: string;
  readonly title: string;
  readonly number: string;
  readonly content: ReactNode;
}

export const PRIVACY_SECTIONS: readonly PrivacySectionData[] = [
  {
    id: 'information-collect',
    number: '1',
    title: 'Information We Collect',
    content: (
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white tracking-wide">Personal Data:</h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            We collect the following personal information when you use our Service:
          </p>
          <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                  <TableHead className="w-1/3 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Data Type</TableHead>
                  <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Purpose</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                  <TableCell className="font-medium text-white text-xs sm:text-sm">Email Address</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">Account creation, authentication, and communication</TableCell>
                </TableRow>
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                  <TableCell className="font-medium text-white text-xs sm:text-sm">Name</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">Personalization of your learning experience</TableCell>
                </TableRow>
                <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                  <TableCell className="font-medium text-white text-xs sm:text-sm">Learning Progress</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">Track vocabulary mastery, spaced repetition scheduling, and progress analytics</TableCell>
                </TableRow>
                <TableRow className="border-none hover:bg-zinc-800/20">
                  <TableCell className="font-medium text-white text-xs sm:text-sm">Usage Data</TableCell>
                  <TableCell className="text-zinc-300 text-xs sm:text-sm">Understand how users interact with the Service to improve features</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">Automatically Collected Data:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>Device information (browser type, operating system)</li>
            <li>IP address (for security and analytics)</li>
            <li>Pages visited and time spent on each page</li>
            <li>Click patterns and interaction data</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'how-use-data',
    number: '2',
    title: 'How We Use Your Data',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We use your data for the following purposes:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>
            <strong className="text-white">Provide the Service:</strong> Deliver vocabulary learning features, track progress, and enable cross-device syncing
          </li>
          <li>
            <strong className="text-white">Improve Our Service:</strong> Analyze usage patterns to enhance features and user experience
          </li>
          <li>
            <strong className="text-white">Communicate with You:</strong> Respond to inquiries, send service updates, and share important notifications
          </li>
          <li>
            <strong className="text-white">Security:</strong> Detect and prevent fraud, abuse, or security vulnerabilities
          </li>
          <li>
            <strong className="text-white">Research:</strong> Aggregate anonymized data for educational research and product development
          </li>
        </ul>
        <p className="text-sm sm:text-base text-primary font-medium leading-relaxed pt-2">
          We never sell, trade, or rent your personal data to third parties.
        </p>
      </div>
    ),
  },
  {
    id: 'third-party-services',
    number: '3',
    title: 'Third-Party Services',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We use the following third-party services to operate IELTS Vocabs:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Service</TableHead>
                <TableHead className="w-1/2 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Purpose</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Privacy Policy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">Vercel</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Web hosting and deployment</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline underline-offset-4 decoration-primary/30"
                  >
                    Vercel Privacy
                  </a>
                </TableCell>
              </TableRow>
              <TableRow className="border-none hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">MongoDB</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Database hosting and management</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <a
                    href="https://www.mongodb.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline underline-offset-4 decoration-primary/30"
                  >
                    MongoDB Privacy
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 italic">
          These services may collect limited data as necessary to provide their services. We encourage you to review their privacy policies.
        </p>
      </div>
    ),
  },
  {
    id: 'cookies',
    number: '4',
    title: 'Cookies and Tracking Technologies',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We use cookies and similar tracking technologies to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
          <li>Remember your preferences and settings</li>
          <li>Track your learning progress across sessions</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Improve service performance</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          <strong className="text-white">You can control cookies:</strong> Most browsers allow you to refuse cookies or delete existing cookies. However, disabling cookies may limit some features of the Service.
        </p>
      </div>
    ),
  },
  {
    id: 'data-retention',
    number: '5',
    title: 'Data Retention',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We retain your data for as long as:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
          <li>Your account is active</li>
          <li>We need it to provide the Service</li>
          <li>We are required to keep it by law</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          You may request deletion of your data at any time (see &ldquo;Your Rights&rdquo; below). Upon deletion request, we will permanently remove your personal data from our systems within 30 days, except where retention is legally required.
        </p>
      </div>
    ),
  },
  {
    id: 'your-rights',
    number: '6',
    title: 'Your Rights',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Depending on your location, you may have the following rights:
        </p>
        <div className="overflow-x-auto my-4 border border-[var(--rb-border-subtle)] rounded-xl bg-zinc-900/20">
          <Table>
            <TableHeader className="bg-zinc-900/50">
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-transparent">
                <TableHead className="w-1/4 text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Right</TableHead>
                <TableHead className="text-zinc-200 font-semibold font-mono text-xs uppercase tracking-wider">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">Access</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Request a copy of the personal data we hold about you</TableCell>
              </TableRow>
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">Correction</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Request correction of inaccurate or incomplete data</TableCell>
              </TableRow>
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">Deletion</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Request deletion of your personal data (&ldquo;right to be forgotten&rdquo;)</TableCell>
              </TableRow>
              <TableRow className="border-[var(--rb-border-subtle)] hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">Portability</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Request transfer of your data to another service</TableCell>
              </TableRow>
              <TableRow className="border-none hover:bg-zinc-800/20">
                <TableCell className="font-medium text-white text-xs sm:text-sm">Opt-Out</TableCell>
                <TableCell className="text-zinc-300 text-xs sm:text-sm">Withdraw consent for data processing at any time</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          To exercise these rights, email us at{' '}
          <a
            href="mailto:support@ielts-vocabs.com"
            className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 decoration-primary/30 transition-colors"
          >
            support@ielts-vocabs.com
          </a>
          . We will respond within 30 days.
        </p>
      </div>
    ),
  },
  {
    id: 'childrens-privacy',
    number: '7',
    title: "Children's Privacy (COPPA Notice)",
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Our Service is not intended for children under 13 years of age.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
          <li>We do not knowingly collect personal information from children under 13</li>
          <li>If we learn we have collected data from a child under 13, we will delete it immediately</li>
          <li>Parents or guardians who believe their child has provided us with personal data should contact us</li>
        </ul>
        <p className="text-xs sm:text-sm text-zinc-400 italic pt-2">
          This notice complies with the Children&apos;s Online Privacy Protection Act (COPPA) requirements.
        </p>
      </div>
    ),
  },
  {
    id: 'data-security',
    number: '8',
    title: 'Data Security',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We implement reasonable security measures to protect your data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
          <li>Encryption in transit (HTTPS/TLS)</li>
          <li>Secure authentication systems</li>
          <li>Regular security audits</li>
          <li>Access controls for our team</li>
        </ul>
        <p className="text-xs sm:text-sm text-zinc-400 italic pt-2">
          However, no internet transmission is 100% secure. We cannot guarantee absolute security.
        </p>
      </div>
    ),
  },
  {
    id: 'international-transfers',
    number: '9',
    title: 'International Data Transfers',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable laws.
        </p>
      </div>
    ),
  },
  {
    id: 'changes-policy',
    number: '10',
    title: 'Changes to This Privacy Policy',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We may update this Privacy Policy periodically. We will notify you of significant changes by:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
          <li>Posting the updated policy on this page</li>
          <li>Updating the &ldquo;Last Updated&rdquo; date</li>
          <li>Sending an email notification (for material changes)</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.
        </p>
      </div>
    ),
  },
  {
    id: 'contact-us',
    number: '11',
    title: 'Contact Us',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          For privacy-related questions, concerns, or requests, please contact us at:
        </p>
        <p className="text-sm sm:text-base text-zinc-300">
          Email:{' '}
          <a
            href="mailto:support@ielts-vocabs.com"
            className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 decoration-primary/30 transition-colors"
          >
            support@ielts-vocabs.com
          </a>
        </p>
        <p className="text-xs sm:text-sm text-zinc-400 italic pt-2">
          We are committed to resolving privacy complaints promptly and fairly.
        </p>
      </div>
    ),
  },
];
