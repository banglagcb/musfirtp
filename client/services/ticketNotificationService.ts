export interface CountryTicketData {
  country: string;
  countryBn: string;
  destination: string;
  destinationBn: string;
  availableTickets: number;
  totalTickets: number;
  lastUpdated: string;
}

export interface NotificationData {
  id: string;
  country: CountryTicketData;
  timestamp: number;
  isVisible: boolean;
}

class TicketNotificationService {
  private static instance: TicketNotificationService;
  private countries: CountryTicketData[] = [];
  private currentIndex = 0;
  private notificationInterval: NodeJS.Timeout | null = null;
  private hideTimeout: NodeJS.Timeout | null = null;
  private subscribers: ((notification: NotificationData | null) => void)[] = [];
  private currentNotification: NotificationData | null = null;

  private constructor() {
    this.initializeCountryData();
  }

  static getInstance(): TicketNotificationService {
    if (!TicketNotificationService.instance) {
      TicketNotificationService.instance = new TicketNotificationService();
    }
    return TicketNotificationService.instance;
  }

  private initializeCountryData() {
    this.countries = [
      {
        country: "UAE (Dubai)",
        countryBn: "সংযুক্ত আরব আমিরাত (দুবাই)",
        destination: "Dubai",
        destinationBn: "দুবাই",
        availableTickets: Math.floor(Math.random() * 50) + 10,
        totalTickets: 60,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "Qatar (Doha)",
        countryBn: "কাতার (দোহা)",
        destination: "Doha",
        destinationBn: "দোহা",
        availableTickets: Math.floor(Math.random() * 40) + 5,
        totalTickets: 45,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "Singapore",
        countryBn: "সিঙ্গাপুর",
        destination: "Singapore",
        destinationBn: "সিঙ্গাপুর",
        availableTickets: Math.floor(Math.random() * 30) + 8,
        totalTickets: 35,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "Thailand (Bangkok)",
        countryBn: "থাইল্যান্ড (ব্যাংকক)",
        destination: "Bangkok",
        destinationBn: "ব্যাংকক",
        availableTickets: Math.floor(Math.random() * 35) + 12,
        totalTickets: 45,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "Malaysia (Kuala Lumpur)",
        countryBn: "মালয়েশিয়া (কুয়ালালামপুর)",
        destination: "Kuala Lumpur",
        destinationBn: "কুয়ালালামপুর",
        availableTickets: Math.floor(Math.random() * 25) + 15,
        totalTickets: 40,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "Turkey (Istanbul)",
        countryBn: "তুরস্ক (ইস্তাম্বুল)",
        destination: "Istanbul",
        destinationBn: "ইস্তাম্বুল",
        availableTickets: Math.floor(Math.random() * 28) + 7,
        totalTickets: 35,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "India (Delhi)",
        countryBn: "ভারত (দিল্লি)",
        destination: "Delhi",
        destinationBn: "দিল্লি",
        availableTickets: Math.floor(Math.random() * 45) + 20,
        totalTickets: 65,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "India (Mumbai)",
        countryBn: "ভারত (মুম্বাই)",
        destination: "Mumbai",
        destinationBn: "মুম্বাই",
        availableTickets: Math.floor(Math.random() * 38) + 18,
        totalTickets: 55,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "India (Kolkata)",
        countryBn: "ভারত (কলকাতা)",
        destination: "Kolkata",
        destinationBn: "কলকাতা",
        availableTickets: Math.floor(Math.random() * 42) + 13,
        totalTickets: 55,
        lastUpdated: new Date().toISOString(),
      },
      {
        country: "UK (London)",
        countryBn: "যুক্তরাজ্য (লন্ডন)",
        destination: "London",
        destinationBn: "লন্ডন",
        availableTickets: Math.floor(Math.random() * 15) + 3,
        totalTickets: 18,
        lastUpdated: new Date().toISOString(),
      },
    ];
  }

  private updateTicketData() {
    // Simulate real-time ticket updates
    this.countries.forEach((country) => {
      // Random small changes to simulate booking activity
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
      country.availableTickets = Math.max(
        0,
        Math.min(country.totalTickets, country.availableTickets + change),
      );
      country.lastUpdated = new Date().toISOString();
    });
  }

  private createNotification(): NotificationData {
    this.updateTicketData();

    const country = this.countries[this.currentIndex];
    const notification: NotificationData = {
      id: `notification-${Date.now()}`,
      country,
      timestamp: Date.now(),
      isVisible: true,
    };

    // Move to next country for next notification
    this.currentIndex = (this.currentIndex + 1) % this.countries.length;

    return notification;
  }

  private showNotification() {
    const notification = this.createNotification();
    this.currentNotification = notification;

    // Notify all subscribers
    this.subscribers.forEach((callback) => callback(notification));

    // Hide after 4 seconds
    this.hideTimeout = setTimeout(() => {
      this.hideNotification();
    }, 4000);
  }

  private hideNotification() {
    if (this.currentNotification) {
      this.currentNotification.isVisible = false;
      this.subscribers.forEach((callback) => callback(null));
      this.currentNotification = null;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  start() {
    if (this.notificationInterval) return;

    // Show first notification immediately
    this.showNotification();

    // Set interval for every 3 minutes (180,000 ms)
    this.notificationInterval = setInterval(() => {
      this.showNotification();
    }, 180000);
  }

  stop() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.hideNotification();
  }

  subscribe(callback: (notification: NotificationData | null) => void) {
    this.subscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Get current notification for initial state
  getCurrentNotification(): NotificationData | null {
    return this.currentNotification;
  }

  // Get all countries data for testing/debugging
  getCountriesData(): CountryTicketData[] {
    return [...this.countries];
  }

  // Manual refresh for testing
  forceUpdate() {
    this.updateTicketData();
    if (this.currentNotification) {
      this.currentNotification.country = this.countries[this.currentIndex];
      this.subscribers.forEach((callback) =>
        callback(this.currentNotification),
      );
    }
  }

  // Reset to fresh state
  reset() {
    this.stop();
    this.currentIndex = 0;
    this.currentNotification = null;
    this.subscribers = [];
    this.initializeCountryData();
  }
}

export default TicketNotificationService.getInstance();
