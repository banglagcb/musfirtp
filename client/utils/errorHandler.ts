// Comprehensive Error Handling and User Feedback System

interface ErrorDetails {
  message: string;
  code?: string;
  context?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Show user-friendly error messages
  showError(error: ErrorDetails, language: "en" | "bn" = "en") {
    const message = this.getLocalizedErrorMessage(error, language);

    // Create toast notification
    this.createToast(message, "error");

    // Log for debugging
    console.error("Application Error:", error);
  }

  // Show success messages
  showSuccess(message: string, language: "en" | "bn" = "en") {
    this.createToast(message, "success");
  }

  // Show warning messages
  showWarning(message: string, language: "en" | "bn" = "en") {
    this.createToast(message, "warning");
  }

  private getLocalizedErrorMessage(
    error: ErrorDetails,
    language: "en" | "bn",
  ): string {
    const messages = {
      en: {
        default: "An error occurred. Please try again.",
        network: "Network error. Please check your connection.",
        validation: "Please check your input and try again.",
        permission: "You do not have permission to perform this action.",
        notFound: "The requested item was not found.",
      },
      bn: {
        default: "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।",
        network: "নেটওয়ার্ক ত্রুটি। আপনার সংযোগ চেক করুন।",
        validation: "আপনার ইনপুট চেক করে আবার চেষ্টা করুন��",
        permission: "এই কাজটি করার অনুমতি আপনার নেই।",
        notFound: "অনুরোধকৃত আইটেমটি পাওয়া যায়নি।",
      },
    };

    const languageMessages = messages[language];

    // Return specific message based on error code, fallback to default
    if (
      error.code &&
      languageMessages[error.code as keyof typeof languageMessages]
    ) {
      return languageMessages[error.code as keyof typeof languageMessages];
    }

    return error.message || languageMessages.default;
  }

  private createToast(message: string, type: "error" | "success" | "warning") {
    // Remove existing toast
    const existingToast = document.getElementById("app-toast");
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;

    // Style based on type
    const styles = {
      error: "bg-red-500 text-white",
      success: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-black",
    };

    toast.className += ` ${styles[type]}`;
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="flex-1">${message}</div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add("translate-x-full");
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }

  // Handle form validation errors
  handleValidationErrors(
    errors: Record<string, string>,
    language: "en" | "bn" = "en",
  ) {
    const errorCount = Object.keys(errors).length;
    if (errorCount > 0) {
      const message =
        language === "bn"
          ? `${errorCount}টি ত্রুটি পাও���়া গেছে। দয়া করে ফর্মটি সংশোধন করুন।`
          : `${errorCount} error(s) found. Please correct the form.`;

      this.showError({ message, code: "validation" }, language);
    }
  }

  // Handle network errors
  handleNetworkError(language: "en" | "bn" = "en") {
    this.showError(
      {
        message: "",
        code: "network",
      },
      language,
    );
  }

  // Handle permission errors
  handlePermissionError(language: "en" | "bn" = "en") {
    this.showError(
      {
        message: "",
        code: "permission",
      },
      language,
    );
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Global error handler for uncaught errors
window.addEventListener("error", (event) => {
  errorHandler.showError({
    message: event.message,
    context: "Global Error",
  });
});

// Global handler for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  errorHandler.showError({
    message: event.reason?.message || "Promise rejection",
    context: "Promise Error",
  });
});
