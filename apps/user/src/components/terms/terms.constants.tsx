import type { ReactNode } from 'react';
import { CONTACT_LINKS } from '@ielts/shared';

export interface TermsSectionData {
  readonly id: string;
  readonly title: string;
  readonly number: string;
  readonly content: ReactNode;
}

export const TERMS_SECTIONS: readonly TermsSectionData[] = [
  {
    id: 'acceptance',
    number: '1',
    title: 'Acceptance of Terms',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          By accessing or using IELTS Vocabs (the &ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use the Service.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          These Terms constitute a legal agreement between you (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and {CONTACT_LINKS.creatorName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), the developer of IELTS Vocabs.
        </p>
      </div>
    ),
  },
  {
    id: 'description',
    number: '2',
    title: 'Description of Service',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          IELTS Vocabs is a free educational web application that provides:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>Access to 3,500+ curated IELTS vocabulary words</li>
          <li>Spaced repetition learning algorithm</li>
          <li>Native British audio pronunciation</li>
          <li>Topic-based word lists</li>
          <li>Progress tracking and cross-device syncing</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          The Service is provided free of charge with no credit card required. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice.
        </p>
      </div>
    ),
  },
  {
    id: 'accounts',
    number: '3',
    title: 'User Accounts & Responsibilities',
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">Account Creation:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>You may need to create an account to access certain features</li>
            <li>You agree to provide accurate, current, and complete information</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">User Responsibilities:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>You agree to use the Service only for lawful purposes</li>
            <li>You shall not attempt to gain unauthorized access to the Service or its systems</li>
            <li>You shall not disrupt or interfere with the Service&apos;s security or functionality</li>
            <li>You shall not use the Service to transmit malware, spam, or malicious code</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'intellectual-property',
    number: '4',
    title: 'Intellectual Property',
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">Our License:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>IELTS Vocabs and its source code are the exclusive proprietary property of {CONTACT_LINKS.creatorName}.</li>
            <li>Subject to your compliance with these Terms, you are granted a limited, personal, non-exclusive, non-transferable, and revocable license to access, view, and use the software for personal and educational purposes only.</li>
            <li>You may not sell, sublicense, rent, lease, distribute, or publish copies of this software or its source code, nor use it for any commercial purposes without explicit written permission from the author.</li>
            <li>You may not modify, distribute modified versions, disassemble, or reverse engineer any part of the software.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">IELTS Trademark:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>IELTS is a registered trademark of the IELTS Partners: IDP Education, British Council, and Cambridge Assessment English.</li>
            <li>IELTS, IELTS logos, and related marks are protected by trademark laws worldwide. We do not claim any ownership rights to the IELTS trademark.</li>
            <li>Your use of the term &ldquo;IELTS&rdquo; in connection with this Service is solely for descriptive purposes to identify the exam for which this vocabulary tool is designed.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'disclaimer',
    number: '5',
    title: 'Disclaimer',
    content: (
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">Independent Study Tool:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>IELTS Vocabs is an independent study tool and is not affiliated with, endorsed by, sponsored by, or connected to IDP Education, British Council, or Cambridge Assessment English</li>
            <li>We have no commercial ties to IELTS administration or test centers</li>
            <li>This Service is not authorized, endorsed, or certified by any official IELTS organization</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white tracking-wide">No Guarantees:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-zinc-300">
            <li>We do not guarantee that using this Service will result in a specific IELTS score</li>
            <li>Vocabulary lists are curated based on research but may not reflect all test content</li>
            <li>The Service is provided for educational purposes only</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'limitation-liability',
    number: '6',
    title: 'Limitation of Liability',
    content: (
      <div className="space-y-4">
        <p className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase mb-1">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>IELTS Vocabs is provided &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; without warranties of any kind, express or implied</li>
          <li>We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Service</li>
          <li>We are not liable for any errors, mistakes, or inaccuracies in the content</li>
          <li>We shall not be liable for any loss or damage arising from your reliance on the Service</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-400 italic pt-2">
          Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above limitations may not apply to you.
        </p>
      </div>
    ),
  },
  {
    id: 'termination',
    number: '7',
    title: 'Termination',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>Breach of these Terms</li>
          <li>Suspected fraudulent or abusive activity</li>
          <li>Extended inactivity</li>
          <li>Any other reason at our sole discretion</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          Upon termination, your right to use the Service will cease immediately.
        </p>
      </div>
    ),
  },
  {
    id: 'changes',
    number: '8',
    title: 'Changes to Terms',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          We reserve the right to modify these Terms at any time. We will notify users of significant changes by:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-300">
          <li>Posting the new Terms on the Service</li>
          <li>Updating the &ldquo;Last Updated&rdquo; date</li>
          <li>Sending an email notification (if you have provided an email address)</li>
        </ul>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
          Your continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>
      </div>
    ),
  },
  {
    id: 'governing-law',
    number: '9',
    title: 'Governing Law',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
        </p>
      </div>
    ),
  },
  {
    id: 'contact',
    number: '10',
    title: 'Contact Information',
    content: (
      <div className="space-y-4">
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          For questions about these Terms, please contact us at{' '}
          <a
            href={`mailto:${CONTACT_LINKS.supportEmail}`}
            className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 decoration-primary/30 transition-colors"
          >
            {CONTACT_LINKS.supportEmail}
          </a>
          .
        </p>
      </div>
    ),
  },
];
