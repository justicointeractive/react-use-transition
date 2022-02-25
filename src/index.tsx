import { useEffect, useRef, useState } from 'react';

export function useTransition<T>(
  ref: HTMLElement | null,
  value: T | null
): {
  mounted: boolean;
  activeClass: boolean;
  value: T | null;
} {
  const shouldBeVisible = value != null;
  const [transitions, setTransitions] = useState(0);
  const [transitionMayBeStarting, setTransitionMayBeStarting] = useState(false);
  const shouldBeVisibleRef = useRef(shouldBeVisible);
  const [hasBeenMounted, setHasBeenMounted] = useState(false);
  const [transitionValue, setTransitionValue] = useState(value);

  useEffect(() => {
    function onTransitionStart() {
      setTransitions((t) => t + 1);
    }
    function onTransitionEnd() {
      setTransitions((t) => t - 1);
    }
    if (ref) {
      ref.addEventListener('transitionstart', onTransitionStart);
      ref.addEventListener('transitionend', onTransitionEnd);
      return () => {
        ref.removeEventListener('transitionstart', onTransitionStart);
        ref.removeEventListener('transitionend', onTransitionEnd);
      };
    }
    return;
  }, [ref]);

  useEffect(() => {
    setTransitionMayBeStarting(true);
    shouldBeVisibleRef.current = shouldBeVisible;
    const timeout = setTimeout(() => setTransitionMayBeStarting(false), 250);
    return () => clearTimeout(timeout);
  }, [shouldBeVisible]);

  const shouldBeMounted =
    shouldBeVisible ||
    transitions > 0 ||
    transitionMayBeStarting ||
    shouldBeVisible !== shouldBeVisibleRef.current;

  useEffect(() => {
    if (shouldBeMounted) {
      const timeout = setTimeout(() => setHasBeenMounted(true), 0);
      return () => clearTimeout(timeout);
    } else {
      setHasBeenMounted(false);
    }
  }, [shouldBeMounted]);

  useEffect(() => {
    if (value != null) {
      setTransitionValue(value);
    } else {
      if (!shouldBeMounted) {
        setTransitionValue(null);
      }
    }
  }, [shouldBeMounted, value]);

  const shouldHaveActiveClass = shouldBeVisible && hasBeenMounted;

  return {
    mounted: shouldBeMounted,
    activeClass: shouldHaveActiveClass,
    value: transitionValue,
  };
}
