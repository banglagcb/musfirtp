import React, {
  memo,
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { useVirtualList, useThrottle } from "@/utils/performance";
import { cn } from "@/lib/utils";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

function VirtualListInner<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
  onScroll,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const { visibleItems, totalHeight, visibleRange } = useVirtualList(
    items,
    containerHeight,
    itemHeight,
    overscan,
  );

  // Throttled scroll handler for better performance
  const handleScroll = useThrottle(
    useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const newScrollTop = e.currentTarget.scrollTop;
        setScrollTop(newScrollTop);
        onScroll?.(newScrollTop);
      },
      [onScroll],
    ),
    16, // ~60fps
  );

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Memoized virtual list component
export const VirtualList = memo(VirtualListInner) as <T>(
  props: VirtualListProps<T>,
) => JSX.Element;

// Enhanced virtual list with search and filtering
interface EnhancedVirtualListProps<T> extends VirtualListProps<T> {
  searchTerm?: string;
  filterFn?: (item: T, searchTerm: string) => boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
}

function EnhancedVirtualListInner<T>({
  items,
  searchTerm = "",
  filterFn,
  emptyMessage = "No items found",
  loadingMessage = "Loading...",
  isLoading = false,
  ...virtualListProps
}: EnhancedVirtualListProps<T>) {
  const filteredItems = useMemo(() => {
    if (!searchTerm || !filterFn) return items;
    return items.filter((item) => filterFn(item, searchTerm));
  }, [items, searchTerm, filterFn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-2 text-gray-600">{loadingMessage}</span>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return <VirtualList {...virtualListProps} items={filteredItems} />;
}

export const EnhancedVirtualList = memo(EnhancedVirtualListInner) as <T>(
  props: EnhancedVirtualListProps<T>,
) => JSX.Element;

// Infinite scrolling virtual list
interface InfiniteVirtualListProps<T> extends VirtualListProps<T> {
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  loadMoreThreshold?: number;
}

function InfiniteVirtualListInner<T>({
  hasNextPage = false,
  isLoadingMore = false,
  onLoadMore,
  loadMoreThreshold = 0.8,
  onScroll,
  containerHeight,
  ...virtualListProps
}: InfiniteVirtualListProps<T>) {
  const handleScroll = useCallback(
    (scrollTop: number) => {
      onScroll?.(scrollTop);

      // Check if we need to load more items
      if (hasNextPage && !isLoadingMore && onLoadMore) {
        const scrollPercentage =
          scrollTop /
          (virtualListProps.itemHeight * virtualListProps.items.length -
            containerHeight);
        if (scrollPercentage >= loadMoreThreshold) {
          onLoadMore();
        }
      }
    },
    [
      hasNextPage,
      isLoadingMore,
      onLoadMore,
      loadMoreThreshold,
      containerHeight,
      virtualListProps.itemHeight,
      virtualListProps.items.length,
      onScroll,
    ],
  );

  return (
    <VirtualList
      {...virtualListProps}
      containerHeight={containerHeight}
      onScroll={handleScroll}
    />
  );
}

export const InfiniteVirtualList = memo(InfiniteVirtualListInner) as <T>(
  props: InfiniteVirtualListProps<T>,
) => JSX.Element;

// Grid virtual list for card layouts
interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

function VirtualGridInner<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  gap = 8,
  renderItem,
  className,
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const rowHeight = itemHeight + gap;

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(
      totalRows,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + 2,
    );
    return { start: Math.max(0, start - 1), end };
  }, [scrollTop, rowHeight, containerHeight, totalRows]);

  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; row: number; col: number }> =
      [];

    for (let row = visibleRange.start; row < visibleRange.end; row++) {
      for (let col = 0; col < itemsPerRow; col++) {
        const index = row * itemsPerRow + col;
        if (index < items.length) {
          result.push({
            item: items[index],
            index,
            row,
            col,
          });
        }
      }
    }

    return result;
  }, [items, visibleRange, itemsPerRow]);

  const handleScroll = useThrottle(
    useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []),
    16,
  );

  return (
    <div
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalRows * rowHeight, position: "relative" }}>
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: row * rowHeight,
              left: col * (itemWidth + gap),
              width: itemWidth,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export const VirtualGrid = memo(VirtualGridInner) as <T>(
  props: VirtualGridProps<T>,
) => JSX.Element;
