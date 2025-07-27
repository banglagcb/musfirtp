import { useCallback, useRef, useEffect, useMemo } from 'react';

// Debounce hook for search/filter inputs
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (throttleRef.current) return;
      
      throttleRef.current = setTimeout(() => {
        callback(...args);
        throttleRef.current = null;
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, options]);

  return isIntersecting;
}

// Virtual list hook for large datasets
export function useVirtualList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    visibleRange,
    setScrollTop,
  };
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
  }

  getAverageMetric(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  getMetrics(): Record<string, { average: number; samples: number }> {
    const result: Record<string, { average: number; samples: number }> = {};
    
    this.metrics.forEach((values, label) => {
      result[label] = {
        average: this.getAverageMetric(label),
        samples: values.length,
      };
    });

    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// React component performance wrapper
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return React.memo((props: P) => {
    const monitor = PerformanceMonitor.getInstance();
    
    useEffect(() => {
      const endTimer = monitor.startTimer(`${componentName}-render`);
      return endTimer;
    });

    return <Component {...props} />;
  });
}

// Image optimization hook
export function useOptimizedImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setHasError(true);
    };
    
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, hasError };
}

// Bundle size analyzer utility
export function analyzeBundleUsage() {
  if (typeof window === 'undefined') return;

  const loadTimes = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintTimes = performance.getEntriesByType('paint');
  
  console.group('🚀 Performance Metrics');
  console.log('📊 Load Times:', {
    'DOM Content Loaded': `${loadTimes.domContentLoadedEventEnd - loadTimes.domContentLoadedEventStart}ms`,
    'Full Load': `${loadTimes.loadEventEnd - loadTimes.loadEventStart}ms`,
    'First Byte': `${loadTimes.responseStart - loadTimes.requestStart}ms`,
  });
  
  console.log('🎨 Paint Times:', 
    paintTimes.reduce((acc, paint) => {
      acc[paint.name] = `${paint.startTime.toFixed(2)}ms`;
      return acc;
    }, {} as Record<string, string>)
  );
  console.groupEnd();
}