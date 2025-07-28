// Complete application reset utility
// This ensures absolutely everything is cleaned for a fresh organizational start

export const performCompleteReset = () => {
  console.log("🔄 Starting complete application reset...");

  try {
    // 1. Clear all localStorage data
    console.log("📂 Clearing localStorage...");
    const keysToKeep = ["air_musafir_fresh_start"]; // Keep only fresh start marker
    const allKeys = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        allKeys.push(key);
      }
    }

    allKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`  ❌ Removed: ${key}`);
    });

    // 2. Set fresh start marker
    localStorage.setItem("air_musafir_fresh_start", "true");
    console.log("  ✅ Set fresh start marker");

    // 3. Clear sessionStorage as well
    console.log("🗂️ Clearing sessionStorage...");
    sessionStorage.clear();

    // 4. Clear any cached data in memory
    console.log("🧹 Clearing memory caches...");

    // Clear any global variables
    if (window.dataService) {
      window.dataService = null;
    }

    // 5. Stop any running intervals/timers
    console.log("⏰ Stopping timers...");

    // Clear all timeouts and intervals
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }

    // 6. Reset IndexedDB if used
    if ("indexedDB" in window) {
      console.log("🗄️ Clearing IndexedDB...");
      try {
        indexedDB.deleteDatabase("air-musafir-db");
      } catch (e) {
        console.log("  ℹ️ No IndexedDB to clear");
      }
    }

    // 7. Clear service worker cache if available
    if ("serviceWorker" in navigator && "caches" in window) {
      console.log("⚙️ Clearing service worker caches...");
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName.includes("air-musafir") ||
              cacheName.includes("travel")
            ) {
              return caches.delete(cacheName);
            }
          }),
        );
      });
    }

    console.log("✅ Complete application reset finished!");
    console.log("🎯 Application is now in completely fresh state");

    return true;
  } catch (error) {
    console.error("❌ Error during complete reset:", error);
    return false;
  }
};

// Function to verify reset was successful
export const verifyResetComplete = () => {
  console.log("🔍 Verifying reset completion...");

  const checks = {
    localStorage:
      Object.keys(localStorage).filter(
        (key) => key !== "air_musafir_fresh_start",
      ).length === 0,
    sessionStorage: sessionStorage.length === 0,
    freshMarker: localStorage.getItem("air_musafir_fresh_start") === "true",
  };

  console.log("📊 Reset verification:");
  console.log(`  localStorage clean: ${checks.localStorage ? "✅" : "❌"}`);
  console.log(`  sessionStorage clean: ${checks.sessionStorage ? "✅" : "❌"}`);
  console.log(`  Fresh start marker: ${checks.freshMarker ? "✅" : "❌"}`);

  const allClean = Object.values(checks).every((check) => check);
  console.log(`🎯 Overall status: ${allClean ? "✅ CLEAN" : "❌ INCOMPLETE"}`);

  return allClean;
};

// Make available globally for console access
if (typeof window !== "undefined") {
  window.performCompleteReset = performCompleteReset;
  window.verifyResetComplete = verifyResetComplete;

  console.log("🛠️ Complete reset utilities loaded:");
  console.log("  • window.performCompleteReset() - Nuclear reset everything");
  console.log("  • window.verifyResetComplete() - Verify clean state");
}

export default performCompleteReset;
