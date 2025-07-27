import { 
  TicketInventory, 
  BulkTicketPurchase, 
  TicketInventoryStats, 
  CountryStats 
} from '@shared/ticket-types';

class TicketInventoryService {
  private static instance: TicketInventoryService;
  private readonly INVENTORY_KEY = 'air_musafir_ticket_inventory';

  private constructor() {
    this.initializeDefaultInventory();
  }

  static getInstance(): TicketInventoryService {
    if (!TicketInventoryService.instance) {
      TicketInventoryService.instance = new TicketInventoryService();
    }
    return TicketInventoryService.instance;
  }

  private initializeDefaultInventory() {
    const inventory = this.getInventory();
    if (inventory.length === 0) {
      // Sample inventory data
      const sampleInventory: TicketInventory[] = [
        {
          id: '1',
          route: 'ঢাকা - দুবাই',
          airline: 'Emirates',
          flightClass: 'Economy',
          purchasePrice: 42000,
          suggestedSalePrice: 50000,
          totalTickets: 50,
          availableTickets: 45,
          lockedTickets: 2,
          soldTickets: 3,
          country: 'সংযুক্ত আরব আমিরাত',
          validFrom: '2024-02-01',
          validTo: '2024-08-31',
          purchaseDate: '2024-01-15',
          supplier: 'Emirates',
          isLocked: false,
          notes: 'বাল্ক ডিসকাউন্ট পেয়েছি'
        },
        {
          id: '2',
          route: 'ঢাকা - কক্সবাজার',
          airline: 'Biman Bangladesh Airlines',
          flightClass: 'Economy',
          purchasePrice: 7500,
          suggestedSalePrice: 10000,
          totalTickets: 30,
          availableTickets: 25,
          lockedTickets: 3,
          soldTickets: 2,
          country: 'বাংলাদেশ',
          validFrom: '2024-02-01',
          validTo: '2024-12-31',
          purchaseDate: '2024-01-20',
          supplier: 'Biman Bangladesh Airlines',
          isLocked: false
        }
      ];
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(sampleInventory));
    }
  }

  // Get all inventory
  getInventory(): TicketInventory[] {
    const inventory = localStorage.getItem(this.INVENTORY_KEY);
    return inventory ? JSON.parse(inventory) : [];
  }

  // Get inventory by ID
  getInventoryById(id: string): TicketInventory | null {
    const inventory = this.getInventory();
    return inventory.find(item => item.id === id) || null;
  }

  // Add bulk ticket purchase
  addBulkPurchase(purchase: BulkTicketPurchase): string {
    const inventory = this.getInventory();
    const newInventoryItem: TicketInventory = {
      id: Date.now().toString(),
      ...purchase,
      totalTickets: purchase.quantity,
      availableTickets: purchase.quantity,
      lockedTickets: 0,
      soldTickets: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      isLocked: false
    };
    
    inventory.push(newInventoryItem);
    localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inventory));
    return newInventoryItem.id;
  }

  // Update inventory item
  updateInventory(id: string, updates: Partial<TicketInventory>): boolean {
    const inventory = this.getInventory();
    const index = inventory.findIndex(item => item.id === id);
    
    if (index !== -1) {
      inventory[index] = { ...inventory[index], ...updates };
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inventory));
      return true;
    }
    return false;
  }

  // Lock/Unlock tickets
  lockTickets(id: string, lockCount: number): boolean {
    const inventory = this.getInventory();
    const item = inventory.find(inv => inv.id === id);
    
    if (item && item.availableTickets >= lockCount) {
      item.availableTickets -= lockCount;
      item.lockedTickets += lockCount;
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inventory));
      return true;
    }
    return false;
  }

  unlockTickets(id: string, unlockCount: number): boolean {
    const inventory = this.getInventory();
    const item = inventory.find(inv => inv.id === id);
    
    if (item && item.lockedTickets >= unlockCount) {
      item.lockedTickets -= unlockCount;
      item.availableTickets += unlockCount;
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inventory));
      return true;
    }
    return false;
  }

  // Sell tickets (when booking is made)
  sellTickets(id: string, quantity: number): boolean {
    const inventory = this.getInventory();
    const item = inventory.find(inv => inv.id === id);
    
    if (item && item.availableTickets >= quantity) {
      item.availableTickets -= quantity;
      item.soldTickets += quantity;
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(inventory));
      return true;
    }
    return false;
  }

  // Get available tickets for booking (exclude locked tickets for managers)
  getAvailableTicketsForBooking(userRole: 'owner' | 'manager'): TicketInventory[] {
    const inventory = this.getInventory();
    
    if (userRole === 'owner') {
      // Admin can see all tickets
      return inventory.filter(item => item.availableTickets > 0);
    } else {
      // Manager can only see non-locked tickets
      return inventory.filter(item => item.availableTickets > 0 && !item.isLocked);
    }
  }

  // Get inventory stats
  getInventoryStats(): TicketInventoryStats {
    const inventory = this.getInventory();
    
    const stats: TicketInventoryStats = {
      totalPurchasedTickets: 0,
      totalAvailableTickets: 0,
      totalLockedTickets: 0,
      totalSoldTickets: 0,
      totalInvestment: 0,
      potentialRevenue: 0,
      actualRevenue: 0,
      countryWiseStats: {}
    };

    inventory.forEach(item => {
      stats.totalPurchasedTickets += item.totalTickets;
      stats.totalAvailableTickets += item.availableTickets;
      stats.totalLockedTickets += item.lockedTickets;
      stats.totalSoldTickets += item.soldTickets;
      stats.totalInvestment += item.totalTickets * item.purchasePrice;
      stats.potentialRevenue += item.availableTickets * item.suggestedSalePrice;
      stats.actualRevenue += item.soldTickets * item.suggestedSalePrice;

      // Country wise stats
      if (!stats.countryWiseStats[item.country]) {
        stats.countryWiseStats[item.country] = {
          country: item.country,
          totalTickets: 0,
          availableTickets: 0,
          lockedTickets: 0,
          soldTickets: 0,
          investment: 0,
          revenue: 0
        };
      }

      const countryStats = stats.countryWiseStats[item.country];
      countryStats.totalTickets += item.totalTickets;
      countryStats.availableTickets += item.availableTickets;
      countryStats.lockedTickets += item.lockedTickets;
      countryStats.soldTickets += item.soldTickets;
      countryStats.investment += item.totalTickets * item.purchasePrice;
      countryStats.revenue += item.soldTickets * item.suggestedSalePrice;
    });

    return stats;
  }

  // Delete inventory item
  deleteInventory(id: string): boolean {
    const inventory = this.getInventory();
    const filteredInventory = inventory.filter(item => item.id !== id);
    
    if (filteredInventory.length !== inventory.length) {
      localStorage.setItem(this.INVENTORY_KEY, JSON.stringify(filteredInventory));
      return true;
    }
    return false;
  }

  // Clear all inventory
  clearAllInventory(): void {
    localStorage.removeItem(this.INVENTORY_KEY);
    this.initializeDefaultInventory();
  }

  // Export inventory to CSV
  exportInventoryToCSV(): string {
    const inventory = this.getInventory();
    const headers = [
      'আইডি',
      'রুট',
      'এয়ারলাইন',
      'ক্লাস',
      'দেশ',
      'ক্রয় মূল্য',
      'বিক্রয় মূল্য',
      'মোট টিকেট',
      'উপলব্ধ',
      'লক',
      'বিক্রিত',
      'সাপ্লায়ার',
      'ক্রয়ের তারিখ',
      'বৈধতা শুরু',
      'বৈধতা শেষ'
    ];

    const csvContent = [
      headers.join(','),
      ...inventory.map(item => [
        item.id,
        item.route,
        item.airline,
        item.flightClass,
        item.country,
        item.purchasePrice,
        item.suggestedSalePrice,
        item.totalTickets,
        item.availableTickets,
        item.lockedTickets,
        item.soldTickets,
        item.supplier,
        item.purchaseDate,
        item.validFrom,
        item.validTo
      ].join(','))
    ].join('\n');

    return csvContent;
  }
}

export default TicketInventoryService.getInstance();
