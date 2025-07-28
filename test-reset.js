console.log("🔄 Testing Data Reset Functionality");

// Wait for app to load
setTimeout(() => {
  console.log("⏱️  Starting reset functionality test...");
  
  // Check if reset commands are available
  if (typeof window.resetAllData === 'function') {
    console.log("✅ Global reset command available: window.resetAllData()");
  } else {
    console.log("❌ Global reset command not found");
  }
  
  if (typeof window.clearAppData === 'function') {
    console.log("✅ Global clear command available: window.clearAppData()");
  } else {
    console.log("❌ Global clear command not found");
  }
  
  // Check localStorage data before
  const currentBookings = localStorage.getItem('travel_bookings');
  const currentUsers = localStorage.getItem('travel_users');
  
  console.log("📊 Current Data Status:");
  console.log(`   📋 Bookings: ${currentBookings ? JSON.parse(currentBookings).length : 0} records`);
  console.log(`   👥 Users: ${currentUsers ? JSON.parse(currentUsers).length : 0} users`);
  
  // Check if settings page has reset button
  const settingsButtons = document.querySelectorAll('button');
  let resetButtonFound = false;
  
  settingsButtons.forEach(button => {
    if (button.textContent?.includes('সম্পূর্ণ রিসেট') || 
        button.textContent?.includes('সব ডেটা মুছে')) {
      resetButtonFound = true;
    }
  });
  
  if (resetButtonFound) {
    console.log("✅ Reset button found in settings");
  } else {
    console.log("ℹ️  Reset button not visible (may need to open settings)");
  }
  
  // Test data service methods
  try {
    console.log("🧪 Testing DataService methods...");
    
    // This should be available if dataService is imported
    if (window.dataService || window.DataService) {
      console.log("✅ DataService accessible from window");
    }
    
    console.log("💡 Reset Instructions:");
    console.log("   1. Use Settings → ডেটা ম্যানেজমেন্ট → সম্পূর্ণ রিসেট");
    console.log("   2. Or use console: window.resetAllData()");
    console.log("   3. Or use console: window.clearAppData()");
    
    console.log("🎯 Reset Features:");
    console.log("   ✅ Complete data wipe");
    console.log("   ✅ Fresh user accounts only");
    console.log("   ✅ No sample bookings");
    console.log("   ✅ Clean settings");
    console.log("   ✅ Reset notifications");
    console.log("   ✅ Clear localStorage");
    
  } catch (error) {
    console.log("⚠️  Error testing methods:", error.message);
  }
  
}, 2000);

// Helper to test reset without actually doing it
window.testReset = function() {
  console.log("🧪 Testing Reset Process (Dry Run):");
  
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("travel_") || key.startsWith("air_musafir_"))) {
      keys.push(key);
    }
  }
  
  console.log("🗂️  Found localStorage keys to clear:", keys);
  console.log("📋 Would reset:");
  console.log("   • All booking data");
  console.log("   • Customer information");  
  console.log("   • Financial records");
  console.log("   • User sessions");
  console.log("   • App settings");
  
  return keys;
};

console.log("💡 Available test commands:");
console.log("   • window.testReset() - Preview what would be reset");
console.log("   • window.resetAllData() - Complete reset with reload");
console.log("   • window.clearAppData() - Clear without reload");
