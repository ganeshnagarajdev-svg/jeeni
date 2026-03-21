import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 m-0">Reports</h1>
          <p class="text-sm text-gray-500 mt-1">Generate and view sales & order analytics.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-xl">
            <span class="text-xs font-bold text-gray-400 uppercase">Period:</span>
            <input type="date" [(ngModel)]="startDate" class="bg-transparent border-none text-sm focus:ring-0">
            <span class="text-gray-300">to</span>
            <input type="date" [(ngModel)]="endDate" class="bg-transparent border-none text-sm focus:ring-0">
          </div>
          <button (click)="loadReports()" class="px-6 py-2 bg-[#1B3C35] text-white rounded-xl text-sm font-semibold hover:bg-[#2c5d53] shadow-md transition-all">
            Generate
          </button>
        </div>
      </div>

      <!-- Advanced Filters -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Customer Search</label>
          <input type="text" [(ngModel)]="customerSearch" (keyup.enter)="loadReports()" 
            placeholder="Search Name or Email..." 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#1B3C35] transition-all outline-none">
        </div>
        <div class="w-40">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</label>
          <select [(ngModel)]="statusFilter" (change)="loadReports()" 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#1B3C35] transition-all outline-none cursor-pointer">
            <option value="">All Successful</option>
            <option value="delivered">Delivered</option>
            <option value="shipping">Shipping</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="w-28">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Min ₹</label>
          <input type="number" [(ngModel)]="minAmount" (keyup.enter)="loadReports()" 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#1B3C35] transition-all outline-none">
        </div>
        <div class="w-28">
          <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Max ₹</label>
          <input type="number" [(ngModel)]="maxAmount" (keyup.enter)="loadReports()" 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:border-[#1B3C35] transition-all outline-none">
        </div>
        <div class="flex items-end self-stretch pt-5">
           <button (click)="resetFilters()" class="text-xs text-gray-400 hover:text-[#F2994A] font-bold transition-colors">RESET</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Order Report Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
          <div *ngIf="orderStats.length > 0" class="space-y-4">
            <div *ngFor="let stat of orderStats" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-3">
                <div [class]="'w-3 h-3 rounded-full ' + getStatusColor(stat.status)"></div>
                <span class="text-sm font-medium text-gray-700 capitalize">{{ stat.status }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-gray-900">{{ stat.count }} orders</div>
                <div class="text-xs text-gray-500">₹{{ stat.total_amount | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>
          <div *ngIf="orderStats.length === 0" class="p-10 text-center text-gray-400">
            No data for selected range
          </div>
        </div>

        <!-- Sales Summary Card -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Sales Summary (Successful)</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-green-50 rounded-2xl">
              <p class="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-1">Total Sales</p>
              <h4 class="text-xl font-bold text-green-700">₹{{ totalSales | number:'1.2-2' }}</h4>
            </div>
            <div class="p-4 bg-orange-50 rounded-2xl">
              <p class="text-[10px] text-orange-600 font-bold uppercase tracking-wider mb-1">Total GST</p>
              <h4 class="text-xl font-bold text-orange-700">₹{{ totalGst | number:'1.2-2' }}</h4>
            </div>
            <div class="p-4 bg-blue-50 rounded-2xl col-span-2">
              <p class="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Net Revenue (Excl. GST)</p>
              <h4 class="text-xl font-bold text-blue-700">₹{{ (totalSales - totalGst) | number:'1.2-2' }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Detail Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">Sales Transactions</h3>
          <button (click)="exportToCSV()" class="text-xs font-bold text-[#F2994A] hover:text-orange-600 transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export CSV
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">GST</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Net</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let sale of salesData" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4 text-sm font-bold">#{{ sale.id }}</td>
                <td class="px-6 py-4 text-sm">{{ sale.customer_name }}</td>
                <td class="px-6 py-4 text-sm">{{ sale.created_at | date:'mediumDate' }}</td>
                <td class="px-6 py-4 text-sm font-semibold">₹{{ sale.total_amount | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">₹{{ sale.total_gst | number:'1.2-2' }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-[#1B3C35]">₹{{ sale.net_amount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="salesData.length === 0" class="p-12 text-center text-gray-400">
            No sales records found
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminReportsComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  orderStats: any[] = [];
  salesData: any[] = [];
  totalSales: number = 0;
  totalGst: number = 0;
  loading: boolean = false;

  // Filters
  customerSearch: string = '';
  statusFilter: string = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  constructor(private adminService: AdminService) {
    // Default to last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    this.startDate = start.toISOString().split('T')[0];
    this.endDate = end.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.adminService.getOrderReport(this.startDate, this.endDate).subscribe({
      next: (data) => this.orderStats = data,
      error: (e) => console.error('Order report error', e)
    });

    this.adminService.getSalesReport(
      this.startDate, 
      this.endDate, 
      this.statusFilter, 
      this.minAmount || undefined, 
      this.maxAmount || undefined, 
      this.customerSearch
    ).subscribe({
      next: (data) => {
        this.salesData = data;
        this.totalSales = data.reduce((sum, item) => sum + item.total_amount, 0);
        this.totalGst = data.reduce((sum, item) => sum + item.total_gst, 0);
        this.loading = false;
      },
      error: (e) => {
        console.error('Sales report error', e);
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.customerSearch = '';
    this.statusFilter = '';
    this.minAmount = null;
    this.maxAmount = null;
    this.loadReports();
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'delivered': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  }

  exportToCSV(): void {
    if (this.salesData.length === 0) return;
    
    const headers = ['Order ID', 'Customer', 'Date', 'Total', 'GST', 'Net'];
    const rows = this.salesData.map(s => [
      s.id,
      s.customer_name,
      s.created_at,
      s.total_amount,
      s.total_gst,
      s.net_amount
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${this.startDate}_to_${this.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
