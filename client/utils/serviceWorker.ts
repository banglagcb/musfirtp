// Service Worker registration and management

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                showUpdateNotification();
              }
            });
          }
        });

        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

function showUpdateNotification() {
  // Create a custom notification or use a toast
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1f2937;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: system-ui;
    max-width: 300px;
  `;
  
  notification.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: 600;">Update Available</div>
    <div style="font-size: 14px; margin-bottom: 12px; opacity: 0.9;">
      A new version is available. Refresh to update.
    </div>
    <button onclick="window.location.reload()" style="
      background: #3b82f6;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    ">Refresh</button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// Performance metrics sender
export function sendPerformanceMetrics(metrics: any) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'PERFORMANCE_METRICS',
      metrics,
    });
  }
}

// Offline status detection
export function createOfflineDetector() {
  let isOnline = navigator.onLine;
  const listeners: ((online: boolean) => void)[] = [];

  function updateOnlineStatus() {
    const wasOnline = isOnline;
    isOnline = navigator.onLine;
    
    if (wasOnline !== isOnline) {
      listeners.forEach(listener => listener(isOnline));
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  return {
    isOnline: () => isOnline,
    onStatusChange: (callback: (online: boolean) => void) => {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    },
    cleanup: () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    },
  };
}
