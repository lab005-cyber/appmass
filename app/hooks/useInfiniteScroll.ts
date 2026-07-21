import { useCallback, useRef } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      const IntersectionObserverImpl =
        typeof IntersectionObserver !== 'undefined'
          ? IntersectionObserver
          : null;

      if (!IntersectionObserverImpl) return;

      observer.current = new IntersectionObserverImpl((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [callback, hasMore, loading]
  );

  return lastElementRef;
}
