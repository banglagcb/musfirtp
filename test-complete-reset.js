console.log("🔄 Testing Complete Data Reset System");

// Wait for app to load
setTimeout(() => {
  console.log("⏱️  Starting complete reset test...");
  
  // Test before reset
  console.log("📊 BEFORE RESET:");
  
  const beforeBookings = localStorage.getItem('travel_bookings');
  const beforeUsers = localStorage.getItem('travel_users');
  const beforeStats = {
    bookings: beforeBookings ? JSON.parse(beforeBookings).length : 0,
    users: beforeUsers ? JSON.parse(beforeUsers).length : 0,
    localStorageKeys: Object.keys(localStorage).length,
    sessionStorageKeys: Object.keys(sessionStorage).length
  };
  
  console.log(`   📋 Bookings: ${beforeStats.bookings}`);
  console.log(`   👥 Users: ${beforeStats.users}`);
  console.log(`   🗂️ localStorage keys: ${beforeStats.localStorageKeys}`);
  console.log(`   💾 sessionStorage keys: ${beforeStats.sessionStorageKeys}`);
  
  // Check for fresh start marker
  const hasFreshMarker = localStorage.getItem("air_musafir_fresh_start");
  console.log(`   🎯 Fresh start marker: ${hasFreshMarker || 'None'}`);
  
  // Test available reset methods
  console.log("\n🧪 Available Reset Methods:");
  
  if (typeof window.resetAllData === 'function') {
    console.log("   ✅ window.resetAllData() - Standard reset");
  }
  
  if (typeof window.clearAppData === 'function') {
    console.log("   ✅ window.clearAppData() - Clear without reload");
  }
  
  if (typeof window.performCompleteReset === 'function') {
    console.log("   ✅ window.performCompleteReset() - Nuclear reset");
  }
  
  if (typeof window.verifyResetComplete === 'function') {
    console.log("   ✅ window.verifyResetComplete() - Verify clean state");
  }
  
  // Test dashboard values
  console.log("\n📊 Dashboard Check:");
  
  // Look for dashboard stats in DOM
  const statsElements = document.querySelectorAll('[class*="text-2xl"], [class*="font-bold"]');
  const dashboardValues = [];
  
  statsElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text && (text.includes('BDT') || /^\d+$/.test(text))) {
      dashboardValues.push(text);
    }
  });
  
  console.log("   📈 Found dashboard values:", dashboardValues);
  
  // Check if all values are zero/empty for fresh state
  const hasNonZeroValues = dashboardValues.some(value => {
    const num = parseInt(value.replace(/[^\d]/g, ''));
    return num > 0;
  });
  
  console.log(`   🎯 Has non-zero values: ${hasNonZeroValues ? 'YES (not fresh)' : 'NO (fresh state)'}`);
  
  console.log("\n💡 Reset Instructions:");
  console.log("   1. UI Method: Settings → ডেটা ম্যানেজমেন্ট → 'সম্পূর্ণ রিসেট করুন'");
  console.log("   2. Console: window.resetAllData() (standard)");
  console.log("   3. Console: window.performCompleteReset() (nuclear)");
  
  console.log("\n🎯 Expected After Reset:");
  console.log("   • All dashboard stats should be 0");
  console.log("   • No sample bookings or customers");
  console.log("   • Only admin/manager users remain");
  console.log("   • Fresh start marker set");
  console.log("   • Complete clean state for new organization");
  
}, 2000);

// Helper function to test reset process
window.testCompleteReset = function() {
  console.log("\n🧪 Testing Complete Reset Process:");
  console.log("⚠️  This will actually perform the reset!");
  
  const confirmed = confirm(
    "🔄 COMPLETE RESET TEST\n\n" +
    "This will:\n" +
    "• Delete ALL data\n" +
    "• Clear ALL storage\n" +
    "• Stop ALL timers\n" +
    "• Reset to completely fresh state\n\n" +
    "Continue with test?"
  );
  
  if (confirmed) {
    console.log("🚀 Starting complete reset...");
    
    // Perform the reset
    if (window.performCompleteReset) {
      window.performCompleteReset();
      
      setTimeout(() => {
        if (window.verifyResetComplete) {
          const isClean = window.verifyResetComplete();
          console.log(`🎯 Reset verification: ${isClean ? 'SUCCESS' : 'INCOMPLETE'}`);
        }
        
        // Reload to see fresh state
        setTimeout(() => {
          console.log("🔄 Reloading to show fresh state...");
          window.location.reload();
        }, 1000);
        
      }, 500);
    } else {
      console.log("❌ Complete reset function not available");
    }
  } else {
    console.log("❌ Reset test cancelled");
  }
};

console.log("\n🛠️ Test Commands:");
console.log("   • window.testCompleteReset() - Test the complete reset");
console.log("   • window.verifyResetComplete() - Check if state is clean");
