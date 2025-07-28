// Language Test Script - Detects hardcoded text issues
console.log("🌐 Language Test Started");

// Common Bengali patterns that should be translated
const bengaliPatterns = [
  /ড্যাশবোর্ড/g,
  /বুকিং/g,
  /রিপোর্ট/g,
  /সেটিংস/g,
  /গ্রাহকের/g,
  /তথ্য/g,
  /তারিখ/g,
  /ফ্লাইট/g,
  /মালিক/g,
  /ম্যানেজার/g,
  /আবশ্যিক/g,
  /��ির্বাচন/g,
  /পরিমাণ/g,
  /সম্পূর্ণ/g,
  /এক্সপোর্ট/g,
];

// Test all text nodes for hardcoded Bengali
function findHardcodedText() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  const issues = [];
  let node;

  while ((node = walker.nextNode())) {
    const text = node.textContent.trim();
    if (text) {
      bengaliPatterns.forEach((pattern, index) => {
        if (pattern.test(text)) {
          issues.push({
            text: text,
            element: node.parentElement,
            pattern: pattern,
          });
        }
      });
    }
  }

  return issues;
}

// Run the test
const issues = findHardcodedText();
console.log(`Found ${issues.length} potential translation issues`);

issues.forEach((issue, index) => {
  console.log(`${index + 1}. "${issue.text}" in`, issue.element);
});

// Test language switching
const languageButton = document.querySelector(
  '[title*="Switch"], [title*="পরিবর্তন"]',
);
if (languageButton) {
  console.log("🔄 Testing language switch...");

  // Record current state
  const beforeText = document.body.innerText;

  // Switch language
  languageButton.click();

  setTimeout(() => {
    const afterText = document.body.innerText;
    const changed = beforeText !== afterText;
    console.log(
      changed ? "✅ Language switching works" : "❌ Language switching failed",
    );

    if (changed) {
      const newIssues = findHardcodedText();
      console.log(`After switch: ${newIssues.length} translation issues`);
    }
  }, 1000);
} else {
  console.log("❌ Language button not found");
}

console.log("🏁 Language test complete");
