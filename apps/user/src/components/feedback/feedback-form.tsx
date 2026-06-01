'use client';

import { axiosInstance, useAuthStore } from '@ielts/auth';
import { Button, Input, Label, Textarea, useToast } from '@ielts/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle, Lightbulb, RefreshCw, Send, ThumbsUp } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { AxiosError } from 'axios';

// ============================================================================
// Types & Interfaces
// ============================================================================

type FeedbackType = 'love' | 'improve' | 'feature' | 'bug';

interface TypeOption {
  readonly id: FeedbackType;
  readonly label: string;
  readonly icon: React.ComponentType<{ readonly size?: number; readonly className?: string }>;
}

interface RatingOption {
  readonly score: number;
  readonly emoji: string;
  readonly label: string;
}

// ============================================================================
// Constants & Helpers
// ============================================================================

const TYPE_OPTIONS: readonly TypeOption[] = [
  { id: 'love', label: 'Working Well', icon: ThumbsUp },
  { id: 'improve', label: 'Needs Improvement', icon: RefreshCw },
  { id: 'feature', label: 'Feature Idea', icon: Lightbulb },
  { id: 'bug', label: 'Bug Report', icon: Bug },
] as const;

const RATING_OPTIONS: readonly RatingOption[] = [
  { score: 1, emoji: '😞', label: 'Awful' },
  { score: 2, emoji: '😐', label: 'Bad' },
  { score: 3, emoji: '🙂', label: 'Good' },
  { score: 4, emoji: '😊', label: 'Great' },
  { score: 5, emoji: '🤩', label: 'Amazing' },
] as const;

const DYNAMIC_PLACEHOLDERS: Record<FeedbackType, string> = {
  love: 'What do you love about IELTS Vocabs? Which features help you the most?',
  improve: "What is frustrating or feeling incomplete? What feels slow or buggy? How can we make it smoother?",
  feature: 'Describe the feature you wish we had. How would it help your IELTS preparation study routine?',
  bug: 'What were you doing when the bug occurred? What happened vs. what did you expect to happen? Can you reproduce it?',
};

function getFriendlyDeviceInfo(userAgent: string): string {
  let os = 'Unknown OS';
  if (userAgent.includes('Win')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

  let browser = 'Unknown Browser';
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('SamsungBrowser')) browser = 'Samsung Browser';
  else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';
  else if (userAgent.includes('Trident')) browser = 'Internet Explorer';
  else if (userAgent.includes('Edge') || userAgent.includes('Edg')) browser = 'Edge';
  else if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';

  return `${browser} on ${os}`;
}

// ============================================================================
// Component
// ============================================================================

export function FeedbackForm() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  // State parameters
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('love');
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Auto-detect browser parameters and prefill email if logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      let friendlyInfo = getFriendlyDeviceInfo(userAgent);

      // Async Brave browser detection override
      const detectBrave = async () => {
        const nav = window.navigator as any;
        if (nav.brave && typeof nav.brave.isBrave === 'function') {
          const isBrave = await nav.brave.isBrave();
          if (isBrave) {
            friendlyInfo = friendlyInfo.replace(/Chrome|Unknown Browser/i, 'Brave');
            setDeviceInfo(friendlyInfo);
          }
        }
      };

      setDeviceInfo(friendlyInfo);
      detectBrave().catch(() => {});
    }
  }, [user]);

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit your feedback.',
        variant: 'destructive',
      });
      setError('You must be logged in to submit feedback.');
      return;
    }

    if (rating === null) {
      setError('Please select a satisfaction rating.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!message.trim()) {
      setError('Please enter your feedback comments.');
      return;
    }

    if (message.trim().length < 3) {
      setError('Feedback comments must be at least 3 characters long.');
      return;
    }

    if (message.trim().length > 2000) {
      setError('Feedback comments cannot exceed 2000 characters.');
      return;
    }

    setError(null);
    setStatus('submitting');

    const payload = {
      feedbackType,
      rating,
      message,
      email,
      deviceInfo,
    };


    try {
      const response = await axiosInstance.post('/feedback', payload);

      setStatus('success');
      toast({
        title: 'Thank You!',
        description: 'Your feedback has been successfully submitted.',
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string; errors?: { path: string; message: string }[] }>;
      let errorMessage = axiosError.response?.data?.message || 'An error occurred while submitting feedback. Please try again.';

      // Extract specific validation messages instead of displaying generic "Validation Error"
      if (axiosError.response?.data?.errors && Array.isArray(axiosError.response.data.errors) && axiosError.response.data.errors.length > 0) {
        errorMessage = axiosError.response.data.errors.map((e) => e.message).join('. ');
      }

      setError(errorMessage);
      setStatus('idle');
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setMessage('');
    setRating(null);
    setStatus('idle');
  };

  return (
    <article className="glass-card rounded-2xl p-5 sm:p-6 w-full text-left relative overflow-hidden">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center py-10 px-4"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 animate-bounce">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">
              Thank You!
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-[42ch] mb-6">
              Your feedback has been successfully submitted. We review every piece of feedback to make IELTS Vocabs better for everyone.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-6 py-2.5 h-auto rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 text-white text-sm font-semibold transition-all duration-300"
            >
              Submit Another Response
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form-state"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <header className="border-b border-[var(--rb-border-subtle)] pb-3 text-center">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Feedback Form
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Directly submit your thoughts or reports below.
              </p>
            </header>

            {/* Horizontal two-column layout — stacks on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-5">

              {/* ── Left Column: selections ── */}
              <div className="flex flex-col gap-4">
                {/* Category tabs */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Category
                  </Label>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {TYPE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = feedbackType === opt.id;
                      return (
                        <Button
                          key={opt.id}
                          type="button"
                          variant="outline"
                          onClick={() => setFeedbackType(opt.id)}
                          className={`px-2 py-2.5 sm:px-3 h-auto rounded-xl border flex items-center justify-start gap-1.5 sm:gap-2 transition-all duration-300 select-none ${
                            isActive
                              ? 'bg-primary/10 border-primary text-white shadow-md shadow-primary/5 hover:bg-primary/20'
                              : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:border-white/10 hover:text-white hover:bg-white/[0.03]'
                          }`}
                        >
                          <Icon size={14} className={isActive ? 'text-primary' : 'text-zinc-500'} />
                          <span className="text-[11px] sm:text-xs font-semibold leading-tight text-left truncate sm:overflow-visible">
                            {opt.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Emoji rating */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Experience Rating
                    </Label>
                    {rating !== null && (
                      <span className="text-xs font-semibold text-primary animate-pulse transition-all duration-300">
                        {RATING_OPTIONS.find((r) => r.score === rating)?.label}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {RATING_OPTIONS.map((opt) => {
                      const isActive = rating === opt.score;
                      return (
                        <Button
                          key={opt.score}
                          type="button"
                          variant="outline"
                          onClick={() => setRating(opt.score)}
                          className={`flex-1 min-w-0 px-0 sm:px-2 py-2 sm:py-1.5 h-auto rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                            isActive
                              ? 'bg-primary/10 border-primary text-white scale-105 shadow-md shadow-primary/5 hover:bg-primary/20'
                              : 'bg-white/[0.01] border-white/5 text-zinc-500 hover:border-white/10 hover:scale-105 hover:bg-white/[0.03]'
                          }`}
                          title={opt.label}
                        >
                          <span className="text-lg sm:text-xl transition-transform duration-300 transform active:scale-95">
                            {opt.emoji}
                          </span>
                          <span className="hidden sm:inline text-[9px] font-mono tracking-tight font-medium text-zinc-400">
                            {opt.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-email" className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-primary/50 text-white placeholder-zinc-500 text-sm px-3 py-2.5 outline-none transition-all duration-300 font-sans"
                  />
                </div>

                {/* Device Info */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-device" className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Environment
                  </Label>
                  <Input
                    id="feedback-device"
                    type="text"
                    value={deviceInfo}
                    readOnly
                    className="w-full rounded-lg bg-white/[0.01] border border-white/5 text-zinc-500 text-sm px-3 py-2.5 outline-none cursor-default font-sans select-none"
                  />
                </div>
              </div>

              {/* ── Right Column: textarea + submit ── */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="feedback-message" className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Your Feedback
                  </Label>
                  <Textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={DYNAMIC_PLACEHOLDERS[feedbackType]}
                    rows={3}
                    className="w-full flex-1 min-h-[160px] rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 focus:border-primary/50 text-white placeholder-zinc-500 text-sm p-3 outline-none transition-all duration-300 resize-none font-sans"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-xs font-semibold text-rose-400 animate-pulse">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="py-2.5 h-auto rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:scale-100 transition-all duration-300 shadow-lg shadow-primary/20 select-none cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </Button>
              </div>

            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </article>
  );
}
