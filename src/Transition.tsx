import { Dispatch, ReactNode, useState } from 'react';
import { useTransition } from './useTransition';

export function Transition<T>({
  value,
  children,
}: {
  value: T;
  children: (props: {
    activeClass: boolean;
    snapshot: T | null;
    ref: Dispatch<HTMLElement | null>;
  }) => ReactNode;
}): JSX.Element | null {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const { activeClass, mounted, snapshot } = useTransition(ref, value);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{mounted && children({ activeClass, snapshot, ref: setRef })}</>;
}
