import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col h-full bg-[#1B3C35] text-white w-64 fixed left-0 top-0 z-50 shadow-xl transition-all duration-300">
      <div class="p-6 flex items-center gap-3 border-b border-[#2c5d53]">
        <div class="w-10 h-10 bg-[#F2994A] rounded-lg flex items-center justify-center font-bold text-xl text-white">J</div>
        <div>
          <h1 class="font-bold text-lg leading-tight text-white m-0">Jeeni Admin</h1>
          <p class="text-[10px] text-gray-300 uppercase tracking-widest m-0">Management Suite</p>
        </div>
      </div>

      <nav class="flex-grow py-6 px-4 space-y-1">
        <a routerLink="/admin/dashboard" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          <span class="font-medium">Dashboard</span>
        </a>
        
        <div class="pt-4 pb-2 px-4">
          <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-widest m-0">Inventory</p>
        </div>

        <a routerLink="/admin/orders" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span class="font-medium">Orders</span>
        </a>

        <a routerLink="/admin/products" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="font-medium">Products</span>
        </a>

        <a routerLink="/admin/categories" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M7 3v18"/><path d="M3 10h4"/><path d="M3 15h4"/></svg>
          <span class="font-medium">Categories</span>
        </a>

        <div class="pt-4 pb-2 px-4">
          <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-widest m-0">Content</p>
        </div>

        <a routerLink="/admin/home-config" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="font-medium">Home Config</span>
        </a>

        <a routerLink="/admin/blogs" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/><path d="M8 15h6"/></svg>
          <span class="font-medium">Blogs</span>
        </a>

        <a routerLink="/admin/careers" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/><path d="M12 12h.01"/></svg>
          <span class="font-medium">Careers</span>
        </a>

        <div class="pt-4 pb-2 px-4">
          <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-widest m-0">Media</p>
        </div>

        <a routerLink="/admin/photos" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <span class="font-medium">Photo Gallery</span>
        </a>

        <a routerLink="/admin/videos" routerLinkActive="bg-[#2c5d53] text-[#F2994A]" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors group no-underline text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
          <span class="font-medium">Video Gallery</span>
        </a>
      </nav>

      <div class="p-4 border-t border-[#2c5d53]">
        <a routerLink="/" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2c5d53] transition-colors text-gray-300 hover:text-white no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span class="font-medium text-sm">Back to Website</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .no-underline { text-decoration: none; }
  `]
})
export class AdminSidebarComponent {}
