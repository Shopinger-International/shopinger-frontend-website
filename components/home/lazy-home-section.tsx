import { type FC, type ReactNode, useEffect, useRef, useState } from "react";

interface ILazyHomeSectionProps {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number;
}

const LazyHomeSection: FC<ILazyHomeSectionProps> = ({
  children,
  rootMargin = "600px 0px",
  minHeight = 200,
}) => {
  const container_ref = useRef<HTMLDivElement | null>(null);
  const [should_render, setShouldRender] = useState(false);

  useEffect(() => {
    const element = container_ref.current;

    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={container_ref} style={!should_render ? { minHeight } : undefined}>
      {should_render ? children : null}
    </div>
  );
};

export default LazyHomeSection;
