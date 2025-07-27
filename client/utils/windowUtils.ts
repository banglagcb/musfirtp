export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

// Ensure window stays within viewport bounds
export function constrainToViewport(
  windowBounds: WindowBounds,
  viewport: ViewportSize,
  margin: number = 20
): WindowBounds {
  const maxX = viewport.width - windowBounds.width - margin;
  const maxY = viewport.height - windowBounds.height - margin;

  return {
    ...windowBounds,
    x: Math.max(margin, Math.min(windowBounds.x, maxX)),
    y: Math.max(margin, Math.min(windowBounds.y, maxY)),
  };
}

// Calculate optimal window size for content
export function calculateOptimalSize(
  contentSize: { width: number; height: number },
  viewport: ViewportSize,
  maxRatio: number = 0.9
): { width: number; height: number } {
  const maxWidth = viewport.width * maxRatio;
  const maxHeight = viewport.height * maxRatio;
  
  let { width, height } = contentSize;
  
  // Scale down if needed while maintaining aspect ratio
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = height * ratio;
  }
  
  if (height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width = width * ratio;
  }
  
  return {
    width: Math.max(400, width), // Minimum width
    height: Math.max(300, height), // Minimum height
  };
}

// Center window in viewport
export function centerInViewport(
  windowSize: { width: number; height: number },
  viewport: ViewportSize
): { x: number; y: number } {
  return {
    x: (viewport.width - windowSize.width) / 2,
    y: (viewport.height - windowSize.height) / 2,
  };
}

// Cascade windows to avoid overlapping
export function cascadeWindow(
  index: number,
  basePosition: { x: number; y: number },
  offset: number = 30
): { x: number; y: number } {
  return {
    x: basePosition.x + (index * offset),
    y: basePosition.y + (index * offset),
  };
}

// Snap to grid for organized layout
export function snapToGrid(
  position: { x: number; y: number },
  gridSize: number = 20
): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

// Check if two windows overlap
export function windowsOverlap(
  window1: WindowBounds,
  window2: WindowBounds
): boolean {
  return !(
    window1.x + window1.width < window2.x ||
    window2.x + window2.width < window1.x ||
    window1.y + window1.height < window2.y ||
    window2.y + window2.height < window1.y
  );
}

// Find non-overlapping position for new window
export function findNonOverlappingPosition(
  newWindow: WindowBounds,
  existingWindows: WindowBounds[],
  viewport: ViewportSize
): { x: number; y: number } {
  let position = { x: newWindow.x, y: newWindow.y };
  let attempts = 0;
  const maxAttempts = 50;
  const stepSize = 30;

  while (attempts < maxAttempts) {
    const testWindow = { ...newWindow, ...position };
    
    // Check if position is valid and doesn't overlap
    if (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + newWindow.width <= viewport.width &&
      position.y + newWindow.height <= viewport.height &&
      !existingWindows.some(existing => windowsOverlap(testWindow, existing))
    ) {
      return position;
    }

    // Try next position in a spiral pattern
    const angle = (attempts * 30) * (Math.PI / 180);
    const radius = Math.floor(attempts / 12) * stepSize + stepSize;
    
    position = {
      x: newWindow.x + Math.cos(angle) * radius,
      y: newWindow.y + Math.sin(angle) * radius,
    };

    attempts++;
  }

  // Fallback to original position if no suitable position found
  return { x: newWindow.x, y: newWindow.y };
}

// Get window state from localStorage
export function saveWindowState(windowId: string, state: any): void {
  try {
    const key = `air_musafir_window_${windowId}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save window state:', error);
  }
}

export function loadWindowState(windowId: string): any | null {
  try {
    const key = `air_musafir_window_${windowId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load window state:', error);
    return null;
  }
}

export function clearWindowState(windowId: string): void {
  try {
    const key = `air_musafir_window_${windowId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear window state:', error);
  }
}
