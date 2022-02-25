# react-use-transition

Transition elements on and off of screen easily. It helps you mount/dismount elements, add/remove classes and holds a ref of a value so you can display it while a transition is happening.

## Usage

```tsx
export function MyComponent({ item }: { item?: { title: string } }) {
  const [wrapperRef, setWrapperRef] = useState<HTMLElement | null>(null);

  const {
    mounted, // boolean, should your element be mounted?
    activeClass, // boolean, should your transition classes be applied?
    value: displayItem, // object, your data item, a ref is held while the element transitions out
  } = useTransitions(wrapperRef, item);

  if (!mounted) {
    return null;
  }

  return (
    (
      <div
        ref={setWrapperRef}
        className={classNames(
          'fixed bottom-0 left-0 right-0 bg-black text-white h-[84px] transition duration-700',
          activeClass ? 'ease-out translate-y-0' : 'ease-in translate-y-full'
        )}
      >
        {displayItem.title}
      </div>
    ) || null
  );
}
```