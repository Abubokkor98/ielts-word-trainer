'use client';

import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import { Button } from '@ielts/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Layers, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import DotField from './dot-field';
import HeroBand from './hero-band';

interface WordCategoryPreset {
  category: string;
  word: string;
  type: string;
  phonetic: string;
}

const CATEGORY_PRESETS: Record<string, WordCategoryPreset> = {
  'Academic Words': {
    category: 'Academic Words',
    word: 'Ubiquitous',
    type: 'adjective',
    phonetic: '/juːˈbɪkwɪtəs/',
  },
  'General Training': {
    category: 'General Training',
    word: 'Ambiguous',
    type: 'adjective',
    phonetic: '/æmˈbɪɡjuəs/',
  },
  'High-Band Idioms': {
    category: 'High-Band Idioms',
    word: 'Burn the midnight oil',
    type: 'idiom',
    phonetic: '/bɜːn ðə ˈmɪdnaɪt ɔɪl/',
  },
};

export function HeroSection() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Minimal states
  const [selectedCategory, setSelectedCategory] = React.useState<string>('Academic Words');
  const [isAudioPlaying, setIsAudioPlaying] = React.useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentWord = CATEGORY_PRESETS[selectedCategory] || CATEGORY_PRESETS['Academic Words'];

  // Actual Text-To-Speech Pronunciation Player
  const triggerAudioWave = () => {
    if (isAudioPlaying) return;
    setIsAudioPlaying(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.95; // Natural speed

      utterance.onend = () => {
        setIsAudioPlaying(false);
      };
      utterance.onerror = () => {
        setIsAudioPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback animation timing if SpeechSynthesis is not supported
      setTimeout(() => setIsAudioPlaying(false), 1200);
    }
  };

  const handleResetCard = () => {
    setSelectedCategory('Academic Words');
    setIsAudioPlaying(false);
  };

  React.useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', onClickOutside);
    return () => document.removeEventListener('pointerdown', onClickOutside);
  }, []);

  const accentColor = '#A855F7';
  const dotGradientFrom = 'rgba(168, 85, 247, 0.35)';
  const dotGradientTo = 'rgba(180, 151, 255, 0.25)'; // Updated to match React Bits DotField gradient settings

  return (
    <section
      className="relative min-h-[100vh] flex items-center justify-center py-12 lg:py-20 overflow-hidden bg-background"
      aria-label="IELTS Master Hero Section"
    >
      {/* React Bits Background Animations */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly={true}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom={dotGradientFrom}
          gradientTo={dotGradientTo}
        />
        <HeroBand
          className="absolute bottom-0 left-0 right-0 h-[150%] w-full pointer-events-none z-[1] mix-blend-screen"
          color={accentColor}
          speed={0.2}
          frequency={1}
          noise={0.15}
          bandWidth={0.14}
          rotation={90}
          fadeTop={0.75}
          iterations={1}
          intensity={1.25}
          scale={1}
          warpStrength={1}
          yOffset={0.3}
          mouseInfluence={0.3}
        />
        {/* Bottom Fade Gradient (SVG with progressive opacity stops to match React Bits 100%) */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-full pointer-events-none z-[2]"
          preserveAspectRatio="none"
          viewBox="0 0 1 1"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hero-bottom-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--background))" stopOpacity="0" />
              <stop offset="60%" stopColor="hsl(var(--background))" stopOpacity="0.03" />
              <stop offset="68%" stopColor="hsl(var(--background))" stopOpacity="0.1" />
              <stop offset="74%" stopColor="hsl(var(--background))" stopOpacity="0.22" />
              <stop offset="80%" stopColor="hsl(var(--background))" stopOpacity="0.38" />
              <stop offset="85%" stopColor="hsl(var(--background))" stopOpacity="0.55" />
              <stop offset="90%" stopColor="hsl(var(--background))" stopOpacity="0.72" />
              <stop offset="94%" stopColor="hsl(var(--background))" stopOpacity="0.87" />
              <stop offset="97%" stopColor="hsl(var(--background))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="1" height="1" fill="url(#hero-bottom-fade)" />
        </svg>
      </div>

      <div className="container max-w-[1324px] px-6 mx-auto relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: Premium Typography & CTAs */}
          <header className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-mono font-semibold text-primary select-none"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>3,500+ High-Band Words · 100% Free</span>
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              Master IELTS <br />
              <span className="text-primary font-black">Vocabulary</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 max-w-[48ch] text-base sm:text-lg text-zinc-400 leading-relaxed"
            >
              Accelerate your English proficiency using spaced repetition, interactive adaptive
              quizzes, and custom progress tracking. Built exactly to push your score to Band 7.5+
              efficiently.
            </motion.p>

            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-10 flex flex-wrap gap-4"
              aria-label="Primary Hero Actions"
            >
              {!isAuthenticated ? (
                <Link
                  href="/vocabulary"
                  className="ielts-master-btn inline-flex items-center justify-center bg-primary text-primary-foreground shadow hover:bg-primary/90 glow-button h-11 px-8 rounded-xl font-semibold tracking-wide transition-all duration-300"
                >
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/vocabulary"
                  className="ielts-master-btn inline-flex items-center justify-center bg-primary text-primary-foreground shadow hover:bg-primary/90 glow-button h-11 px-8 rounded-xl font-semibold tracking-wide transition-all duration-300"
                >
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </motion.nav>
          </header>

          {/* RIGHT COLUMN: Minimal Interactive Vocabulary Card (React Bits Glassmorphism Card 100% same) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.article
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="w-full max-w-md glass-card rounded-[14px] flex flex-col overflow-hidden"
              role="region"
              aria-label="Minimal IELTS Vocabulary Card"
            >
              {/* Header with Traffic Light Windows dots (Subtle white/gray dots to match React Bits) */}
              <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 select-none bg-black/20 rounded-t-[14px]">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>

                {/* Category Dropdown Selector */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 px-3 h-8 text-xs font-mono font-medium text-white/50 bg-white/[0.01] border border-white/10 hover:text-white hover:bg-white/10 rounded-md transition-all"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Layers className="h-3 w-3" />
                    <span>{selectedCategory}</span>
                  </Button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-[#1a1622] border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col p-1"
                      >
                        {['Academic Words', 'General Training', 'High-Band Idioms'].map((cat) => (
                          <Button
                            key={cat}
                            variant="ghost"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full justify-start text-xs font-mono text-zinc-400 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 h-auto"
                          >
                            {cat}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reset Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetCard}
                  className="h-8 w-8 text-white/50 bg-white/[0.01] border border-white/10 hover:text-white hover:bg-white/10 rounded-md transition-all flex items-center justify-center"
                  aria-label="Reset Card"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </header>

              {/* Central Flashcard Display Area */}
              <section className="p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="min-h-[72px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.h2
                        key={currentWord.word}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.25 }}
                        className="text-2xl font-extrabold text-white tracking-tight leading-tight"
                      >
                        {currentWord.word}
                      </motion.h2>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentWord.word}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mt-1 text-xs font-mono"
                      >
                        <span className="text-primary font-bold">{currentWord.type}</span>
                        <span className="text-zinc-400 font-semibold">{currentWord.phonetic}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Audio Speaker trigger */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={triggerAudioWave}
                    className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white shadow-sm"
                    aria-label="Listen Pronunciation"
                  >
                    <Volume2
                      className={`h-5 w-5 ${isAudioPlaying ? 'animate-bounce text-primary' : ''}`}
                    />
                  </Button>
                </div>

                {/* Audio Wave Visualizer Animation */}
                <div
                  className="h-4 flex items-center gap-0.5 mt-4 overflow-hidden select-none"
                  aria-hidden="true"
                >
                  {Array.from({ length: 24 }, (_, idx) => `wave-bar-${idx}`).map((barId, i) => (
                    <motion.span
                      key={barId}
                      className="w-1 rounded-full bg-primary/45"
                      animate={{
                        height: isAudioPlaying
                          ? [4, Math.max(4, Math.sin(i + Math.random() * 5) * 16), 4]
                          : 4,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: isAudioPlaying ? Infinity : 0,
                        repeatType: 'reverse',
                        delay: i * 0.02,
                      }}
                    />
                  ))}
                </div>
              </section>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
