import { useEffect, useState } from 'react';

const useHookIntersectionObserver = ({
  root,
  selector,
  rootMargin,
}: {
  root: string;
  selector: string;
  rootMargin?: string;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rootElement = document.querySelector(root);
    const element = document.querySelector(selector);

    if (!rootElement || !element) {
      setVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      { root: rootElement, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, selector, rootMargin]);

  return visible;
};

export default useHookIntersectionObserver;
