import { Booking, User, DashboardStats, FilterOptions, ReportData } from '@shared/travel-types';
import dataService from './dataService';

class EnhancedDataService {
  private static instance: EnhancedDataService;

  private constructor() {}

  static getInstance(): EnhancedDataService {
    if (!EnhancedDataService.instance) {
      EnhancedDataService.instance = new EnhancedDataService();
    }
    return EnhancedDataService.instance;
  }

  private async simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(operation: string, error: any): never {
    console.error(`Error in ${operation}:`, error);
    throw new Error(`${operation} ব্যর্থ হয়েছে। আবার চেষ্টা করুন।`);
  }

  async getBookings(): Promise<Booking[]> {
    try {
      await this.simulateDelay(300);
      return dataService.getBookings();
    } catch (error) {
      this.handleError('বুকিং তালিকা লোড', error);
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      await this.simulateDelay(200);
      return dataService.getBookingById(id);
    } catch (error) {
      this.handleError('বুকিং বিস্তারিত লোড', error);
    }
  }

  async addBooking(booking: Omit<Booking, 'id' | 'bookingDate'>): Promise<Booking> {
    try {
      await this.simulateDelay(800);
      return dataService.addBooking(booking);
    } catch (error) {
      this.handleError('নতুন বুকিং যোগ', error);
      throw error;
    }
  }

  async updateBooking(id: string, updatedBooking: Partial<Booking>): Promise<boolean> {
    try {
      await this.simulateDelay(700);
      const result = dataService.updateBooking(id, updatedBooking);
      if (!result) {
        throw new Error('বুকিং আপডেট করা যায়নি');
      }
      return result;
    } catch (error) {
      this.handleError('বুকিং আপডেট', error);
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      await this.simulateDelay(500);
      const result = dataService.deleteBooking(id);
      if (!result) {
        throw new Error('বুকিং ডিলিট করা যায়নি');
      }
      return result;
    } catch (error) {
      this.handleError('বুকিং ডিলিট', error);
    }
  }

  async searchBookings(filters: FilterOptions): Promise<Booking[]> {
    try {
      await this.simulateDelay(400);
      return dataService.searchBookings(filters);
    } catch (error) {
      this.handleError('বুকিং সার্চ', error);
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      await this.simulateDelay(600);
      return dataService.getDashboardStats();
    } catch (error) {
      this.handleError('ড্যাশবোর্ড পরিসংখ্যান লোড', error);
    }
  }

  async getMonthlyReport(year: number, month: number): Promise<ReportData[]> {
    try {
      await this.simulateDelay(800);
      return dataService.getMonthlyReport(year, month);
    } catch (error) {
      this.handleError('মাসিক রিপোর্ট তৈরি', error);
    }
  }

  async exportToCSV(): Promise<string> {
    try {
      await this.simulateDelay(1000);
      return dataService.exportToCSV();
    } catch (error) {
      this.handleError('CSV এক্সপোর্ট', error);
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      await this.simulateDelay(1000);
      return dataService.validateUser(username, password);
    } catch (error) {
      this.handleError('ইউজার যাচাই', error);
    }
  }

  // Synchronous methods that don't need enhancement
  getUsers(): User[] {
    return dataService.getUsers();
  }

  clearAllData(): void {
    return dataService.clearAllData();
  }
}

export default EnhancedDataService.getInstance();
