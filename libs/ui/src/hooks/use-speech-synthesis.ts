'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseSpeechSynthesisOptions {
  text: string;
  lang?: string;
  voiceLang?: string;
}

export interface UseSpeechSynthesisReturn {
  speak: () => void;
  isSpeaking: boolean;
  isLoading: boolean;
  isSupported: boolean;
}

/**
 * Hook for text-to-speech using Web Speech API
 * Preloads voices and creates utterance on mount for instant playback
 */
export function useSpeechSynthesis({
  text,
  lang = 'en',
  voiceLang = 'en-GB', // UK English by default
}: UseSpeechSynthesisOptions): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setIsLoading(false);
    }
  }, []);

  // Load and select the best voice
  const loadVoices = useCallback(() => {
    if (!isSupported) return;

    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) return;

    // Select voice: exact match → language family → any English → first available
    const selectedVoice =
      voices.find((voice) => voice.lang === voiceLang) ||
      voices.find((voice) => voice.lang.startsWith(voiceLang.split('-')[0])) ||
      voices.find((voice) => voice.lang.startsWith('en')) ||
      voices[0];

    selectedVoiceRef.current = selectedVoice || null;

    // Pre-create utterance for instant playback
    if (!utteranceRef.current && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
    }

    setIsLoading(false);
  }, [isSupported, text, lang, voiceLang]);

  // Initialize voices on mount and listen for voiceschanged
  useEffect(() => {
    if (!isSupported) return;
// Load voices immediately if available
    loadVoices();
    // Listen for voiceschanged event (fires when voices are loaded)
    const handleVoicesChanged = () => loadVoices();
    window.speechSynthesis.addEventListener(
      'voiceschanged',
      handleVoicesChanged
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        'voiceschanged',
        handleVoicesChanged
      );
    };
  }, [isSupported, loadVoices]);

  // Update utterance text when it changes
  useEffect(() => {
    if (!isSupported || !utteranceRef.current) return;
    utteranceRef.current.text = text;
  }, [text, isSupported]);

  // Speak with instant playback
  const speak = useCallback(() => {
    if (!isSupported || !utteranceRef.current || isSpeaking) return;

    window.speechSynthesis.cancel(); // Clear queue for instant playback
    window.speechSynthesis.speak(utteranceRef.current);
  }, [isSupported, isSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    isSpeaking,
    isLoading,
    isSupported,
  };
}
