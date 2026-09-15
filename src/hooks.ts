import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Lang } from './data';

/* Language context shared across the app */
export const LangCtx = createContext<Lang>('en');
export const useLang = () => useContext(LangCtx);

/* IntersectionObserver hook — fires once when element enters viewport */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* Animated counter with ease-out cubic */
export function useCounter(target: number, start: boolean, duration = 1900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return v;
}

/* Typewriter effect cycling through phrases */
export function useTyping(words: string[], typeSpeed = 62, deleteSpeed = 30, pause = 1700) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length];
    let to: ReturnType<typeof setTimeout>;
    if (!del && txt === w) {
      to = setTimeout(() => setDel(true), pause);
    } else if (del && txt === '') {
      setDel(false);
      setI((p) => (p + 1) % words.length);
    } else {
      to = setTimeout(() => {
        setTxt((p) => (del ? w.slice(0, p.length - 1) : w.slice(0, p.length + 1)));
      }, del ? deleteSpeed : typeSpeed);
    }
    return () => clearTimeout(to);
  }, [txt, del, i, words, typeSpeed, deleteSpeed, pause]);
  return txt;
}

/* Track window scroll position */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const f = () => setY(window.scrollY);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return y;
}

/* Copy-to-clipboard with feedback state */
export function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  return { copied, copy };
}
