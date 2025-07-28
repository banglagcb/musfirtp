import dataService from '../services/dataService';

// Global function for easy access in console
declare global {
  interface Window {
    resetAllData: () => void;
    clearAppData: () => void;
  }
}

// Console command to reset all data
export const resetAllData = () => {
  const confirmed = confirm(
    'Are you sure you want to reset ALL data?\n\n' +
    'This will delete:\n' +
    '• All bookings and customer information\n' +
    '• All balance, profit and revenue data\n' +
    '• All history and records\n' +
    '• All settings and configurations\n\n' +
    'This action cannot be undone!'
  );
  
  if (confirmed) {
    console.log('🗑️ Resetting all application data...');
    dataService.resetToFreshState();
  }
};

// Console command to clear data without reload
export const clearAppData = () => {
  const confirmed = confirm(
    'Clear all stored data without page reload?\n\n' +
    'This will clear all data but keep the current session.'
  );
  
  if (confirmed) {
    console.log('🧹 Clearing all application data...');
    dataService.clearAllData();
    console.log('✅ Data cleared successfully!');
  }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.resetAllData = resetAllData;
  window.clearAppData = clearAppData;
  
  // Log available commands
  console.log('📋 Available data reset commands:');
  console.log('• window.resetAllData() - Complete reset with page reload');
  console.log('• window.clearAppData() - Clear data without reload');
}

export { resetAllData as default };
