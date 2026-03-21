import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, User } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 m-0">User Management</h1>
          <p class="text-sm text-gray-500 mt-1">Manage user roles and permissions.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-100">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th class="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let user of users" class="hover:bg-gray-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-gray-900">{{ user.full_name || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <select (change)="updateRole(user, $event)" [value]="user.role" 
                    [disabled]="user.is_superuser"
                    class="text-xs font-semibold px-2 py-1 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#F2994A] transition-all">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                   <span [class]="'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ' + (user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="toggleStatus(user)" 
                    [disabled]="user.is_superuser"
                    class="p-2 text-gray-400 hover:text-[#1B3C35] hover:bg-green-50 rounded-lg transition-all" 
                    [title]="user.is_active ? 'Deactivate' : 'Activate'">
                    <i [class]="user.is_active ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                    <svg *ngIf="user.is_active" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>
                    <svg *ngIf="!user.is_active" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="loading" class="p-12 text-center">
          <div class="inline-block animate-spin w-8 h-8 border-4 border-gray-200 border-t-[#F2994A] rounded-full mb-4"></div>
          <p class="text-sm text-gray-500 font-medium">Loading users...</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.toastService.error('Failed to load users');
      }
    });
  }

  updateRole(user: User, event: any): void {
    const newRole = event.target.value;
    this.adminService.updateUser(user.id, { role: newRole }).subscribe({
      next: () => {
        user.role = newRole;
        this.toastService.success(`Role updated for ${user.email}`);
      },
      error: (e) => this.toastService.error('Failed to update role')
    });
  }

  toggleStatus(user: User): void {
    const newStatus = !user.is_active;
    this.adminService.updateUser(user.id, { is_active: newStatus }).subscribe({
      next: () => {
        user.is_active = newStatus;
        this.toastService.success(`User ${newStatus ? 'activated' : 'deactivated'}`);
      },
      error: (e) => this.toastService.error('Failed to update status')
    });
  }
}
