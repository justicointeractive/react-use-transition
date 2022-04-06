import { useEffect, useRef, useState } from 'react';

export function useTransition<T>(
  ref: HTMLElement | null,
  value: T | null
): {
  mounted: boolean;
  activeClass: boolean;
  snapshot: T | null;
} {
  const shouldBeVisible = value != null;

  const [transitions, setTransitions] = useState<boolean>(false);
  const [transitionMayBeStarting, setTransitionMayBeStarting] = useState(false);
  const shouldBeVisibleRef = useRef(shouldBeVisible);
  const [hasBeenMounted, setHasBeenMounted] = useState(false);
  const [transitionValue, setTransitionValue] = useState(value);

  useEffect(() => {
    let transitions: EventTarget[] = [];
    function onTransitionStart({ target: eventTarget }: Event) {
      if (eventTarget) {
        transitions = [...transitions, eventTarget];
        setTransitions(transitions.length > 0);
      }
    }
    function onTransitionEnd({ target: eventTarget }: Event) {
      if (eventTarget) {
        transitions = transitions.filter((target) => target != eventTarget);
        setTransitions(transitions.length > 0);
      }
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
    if (shouldBeVisibleRef.current !== shouldBeVisible) {
      setTransitionMayBeStarting(true);
      shouldBeVisibleRef.current = shouldBeVisible;
      const timeout = setTimeout(() => setTransitionMayBeStarting(false), 250);
      return () => clearTimeout(timeout);
    }
    return;
  }, [shouldBeVisible]);

  const shouldBeMounted =
    shouldBeVisible ||
    transitions ||
    transitionMayBeStarting ||
    shouldBeVisible !== shouldBeVisibleRef.current;

  useEffect(() => {
    if (shouldBeMounted) {
      const timeout = setTimeout(() => setHasBeenMounted(true), 0);
      return () => clearTimeout(timeout);
    } else {
      setHasBeenMounted(false);
      return;
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
    snapshot: transitionValue,
  };
}
