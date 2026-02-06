import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../core/services/general.service';
import { ContentService } from '../../../core/services/content.service';
import { HomeSection } from '../../../core/models/home-section';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-secondary-900">Home Page Configuration</h2>
        <button (click)="createNewSection()" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add New Section
        </button>
      </div>

      <!-- Feedback Banner -->
       <div *ngIf="message" [class]="'mb-4 p-4 rounded-lg flex items-center justify-between ' + (messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
          <span>{{ message }}</span>
          <button (click)="message = ''" class="text-lg">&times;</button>
       </div>

      <div class="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-secondary-50 border-b border-secondary-200">
              <th class="px-6 py-4 font-bold text-secondary-700 w-16"></th>
              <th class="px-6 py-4 font-bold text-secondary-700">Title</th>
              <th class="px-6 py-4 font-bold text-secondary-700">Type</th>
              <th class="px-6 py-4 font-bold text-secondary-700">Status</th>
              <th class="px-6 py-4 font-bold text-secondary-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody (dragover)="onDragOver($event)">
            <tr *ngFor="let section of sections; let i = index" 
                draggable="true"
                (dragstart)="onDragStart(i)"
                (dragenter)="onDragEnter(i)"
                (dragend)="onDragEnd()"
                [class.opacity-40]="draggedIndex === i"
                [class.border-t-2]="dropIndex === i && draggedIndex !== i"
                [class.border-primary-500]="dropIndex === i && draggedIndex !== i"
                class="border-b border-secondary-100 hover:bg-secondary-50/50 transition-all cursor-move relative">
              <td class="px-6 py-4 text-secondary-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </td>
              <td class="px-6 py-4 font-medium text-secondary-900">{{ section.title || 'Untitled' }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-bold uppercase">{{ section.section_type }}</span>
              </td>
              <td class="px-6 py-4">
                <button (click)="toggleActive(section)" [class]="section.is_active ? 'text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold' : 'text-secondary-400 bg-secondary-50 px-2 py-1 rounded text-xs font-bold'">
                  {{ section.is_active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button (click)="editSection(section)" class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button (click)="deleteSection(section)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Editor Modal -->
       <div *ngIf="isEditing" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
              <div class="p-6 border-b border-secondary-100 flex justify-between items-center bg-white z-10 font-sans">
                  <div>
                    <h3 class="text-xl font-bold">{{ selectedSection?.id ? 'Edit Section' : 'New Section' }}</h3>
                    <p class="text-sm text-secondary-500">{{ editData.section_type | uppercase }} Section</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 text-sm bg-secondary-100 p-1 rounded-lg">
                        <button (click)="jsonMode = false" [class]="!jsonMode ? 'bg-white shadow px-3 py-1 rounded-md font-medium text-primary-600' : 'px-3 py-1 text-secondary-600 hover:text-secondary-900'">Simple UI</button>
                        <button (click)="jsonMode = true" [class]="jsonMode ? 'bg-white shadow px-3 py-1 rounded-md font-medium text-primary-600' : 'px-3 py-1 text-secondary-600 hover:text-secondary-900'">JSON Mode</button>
                    </div>
                    <button (click)="isEditing = false" class="text-secondary-400 hover:text-secondary-600 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
              </div>
              
              <div class="p-6 overflow-y-auto flex-1 space-y-6 font-sans">
                  <div *ngIf="error" class="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 mb-4">
                    {{ error }}
                  </div>

                  <!-- Common Metadata -->
                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="block text-sm font-medium text-secondary-700 mb-1">Section Title (Admin Internal)</label>
                          <input type="text" [(ngModel)]="editData.title" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-secondary-700 mb-1">Section Type</label>
                          <select [(ngModel)]="editData.section_type" (change)="onTypeChange()" class="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                              <option value="hero">Hero Section</option>
                              <option value="features">Key Features</option>
                              <option value="categories">Categories Grid</option>
                              <option value="benefits">Benefits & Usage</option>
                              <option value="product_grid">Featured Products</option>
                              <option value="cta">Newsletter / CTA</option>
                              <option value="carousel">Main Carousel</option>
                          </select>
                      </div>
                  </div>

                  <!-- UI Form Mode -->
                  <div *ngIf="!jsonMode" class="space-y-6">
                      
                      <!-- HERO FORM -->
                      <div *ngIf="editData.section_type === 'hero'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="space-y-4 font-sans">
                              <div>
                                  <label class="block text-xs font-bold text-secondary-500 uppercase tracking-tight mb-1">Main Title (Supports HTML)</label>
                                  <input type="text" [(ngModel)]="parsedConfig.title" class="w-full px-4 py-2 border rounded-lg">
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-secondary-500 uppercase tracking-tight mb-1">Subtitle</label>
                                  <input type="text" [(ngModel)]="parsedConfig.subtitle" class="w-full px-4 py-2 border rounded-lg">
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-secondary-500 uppercase tracking-tight mb-1">Description</label>
                                  <textarea [(ngModel)]="parsedConfig.description" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
                              </div>
                              <div class="grid grid-cols-2 gap-2">
                                  <div>
                                      <label class="block text-xs font-bold text-secondary-500 uppercase tracking-tight mb-1">Primary Btn Text</label>
                                      <input type="text" [(ngModel)]="parsedConfig.primary_btn_text" class="w-full px-4 py-2 border rounded-lg">
                                  </div>
                                  <div>
                                      <label class="block text-xs font-bold text-secondary-500 uppercase tracking-tight mb-1">Primary Btn Link</label>
                                      <input type="text" [(ngModel)]="parsedConfig.primary_btn_link" class="w-full px-4 py-2 border rounded-lg" placeholder="/shop">
                                  </div>
                              </div>
                          </div>
                          <div class="space-y-4">
                              <div>
                                  <label class="block text-xs font-bold text-secondary-500 uppercase">Front Image URL / Upload</label>
                                  <div class="flex gap-2 mb-2">
                                      <input type="text" [(ngModel)]="parsedConfig.image_url" class="flex-1 px-4 py-2 border rounded-lg text-sm bg-white" placeholder="URL or select file">
                                      <button (click)="fileHero.click()" class="bg-secondary-100 hover:bg-secondary-200 p-2 rounded-lg transition-colors" title="Upload Image">
                                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                      </button>
                                      <input #fileHero type="file" (change)="onImageUploaded($event, parsedConfig, 'image_url')" class="hidden" accept="image/*">
                                  </div>
                                  <div *ngIf="parsedConfig.image_url" class="p-2 border rounded-lg bg-secondary-50 flex items-center gap-2">
                                      <img [src]="getImageUrl(parsedConfig.image_url)" class="h-10 w-10 object-cover rounded shadow-sm">
                                      <span class="text-[10px] text-secondary-400 truncate flex-1">{{ parsedConfig.image_url }}</span>
                                  </div>
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-secondary-500 uppercase">Background Image URL / Upload</label>
                                  <div class="flex gap-2 mb-2">
                                      <input type="text" [(ngModel)]="parsedConfig.bg_image_url" class="flex-1 px-4 py-2 border rounded-lg text-sm bg-white" placeholder="URL or select file">
                                      <button (click)="fileHeroBg.click()" class="bg-secondary-100 hover:bg-secondary-200 p-2 rounded-lg transition-colors" title="Upload Image">
                                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                      </button>
                                      <input #fileHeroBg type="file" (change)="onImageUploaded($event, parsedConfig, 'bg_image_url')" class="hidden" accept="image/*">
                                  </div>
                              </div>
                          </div>
                      </div>

                      <!-- FEATURES FORM -->
                      <div *ngIf="editData.section_type === 'features'" class="space-y-4">
                          <div class="grid grid-cols-3 gap-4">
                              <div><label class="block text-xs font-bold text-secondary-500 mb-1">Header Span</label><input type="text" [(ngModel)]="parsedConfig.header" class="w-full px-3 py-2 border rounded"></div>
                              <div class="col-span-2"><label class="block text-xs font-bold text-secondary-500 mb-1">Main Title</label><input type="text" [(ngModel)]="parsedConfig.title" class="w-full px-3 py-2 border rounded"></div>
                          </div>
                          <div><label class="block text-xs font-bold text-secondary-500 mb-1">Description</label><textarea [(ngModel)]="parsedConfig.subtitle" class="w-full px-3 py-2 border rounded"></textarea></div>
                          
                          <p class="font-bold text-secondary-900 border-b pb-1">Features Grid (Max 3)</p>
                          <div *ngFor="let feat of parsedConfig.features; let i = index" class="p-4 bg-secondary-50 rounded-lg border flex gap-4">
                              <input type="text" [(ngModel)]="feat.icon" placeholder="Icon (e.g. 🌾)" class="w-20 px-2 py-1 border rounded h-fit">
                              <div class="flex-1 space-y-2">
                                  <input type="text" [(ngModel)]="feat.title" placeholder="Feature Title" class="w-full px-2 py-1 border rounded font-medium">
                                  <textarea [(ngModel)]="feat.description" placeholder="Description" rows="2" class="w-full px-2 py-1 border rounded text-sm"></textarea>
                              </div>
                              <button (click)="removeItem(parsedConfig.features, i)" class="text-red-500 hover:text-red-700 h-fit transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
                          </div>
                          <button (click)="addItem('features')" class="text-sm text-primary-600 font-bold hover:underline transition-all">+ Add Feature</button>
                      </div>

                      <!-- CAROUSEL FORM -->
                      <div *ngIf="editData.section_type === 'carousel'" class="space-y-6">
                          <div class="flex gap-6 items-center bg-secondary-50 p-4 rounded-xl border border-secondary-200">
                              <div class="flex items-center gap-2">
                                  <input type="checkbox" [(ngModel)]="parsedConfig.autoplay" class="w-4 h-4 text-primary-600 rounded border-secondary-300">
                                  <label class="text-sm font-medium text-secondary-700">Enable Autoplay</label>
                              </div>
                              <div>
                                  <label class="text-sm font-medium text-secondary-700 mr-2">Interval (ms)</label>
                                  <input type="number" [(ngModel)]="parsedConfig.interval" class="w-24 px-2 py-1 border rounded outline-none focus:ring-2 focus:ring-primary-500/20">
                              </div>
                          </div>

                          <div class="space-y-4">
                              <div *ngFor="let item of parsedConfig.items; let i = index" class="p-6 bg-white border border-secondary-200 rounded-2xl shadow-sm space-y-4 relative">
                                  <div class="absolute top-4 right-4 flex gap-2">
                                      <span class="bg-secondary-100 text-secondary-600 px-2 py-1 rounded text-xs font-bold uppercase">Slide #{{ i + 1 }}</span>
                                      <button (click)="removeItem(parsedConfig.items, i)" class="text-red-500 hover:text-red-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
                                  </div>
                                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div class="space-y-4">
                                          <div>
                                              <label class="block text-xs font-bold text-secondary-500 uppercase">Image URL / Upload</label>
                                              <div class="flex gap-2 mb-2">
                                                  <input type="text" [(ngModel)]="item.image_url" class="flex-1 px-3 py-2 border rounded-lg bg-secondary-50 text-sm" placeholder="URL or select file">
                                                  <button (click)="fileCarousel.click()" class="bg-secondary-100 hover:bg-secondary-200 p-2 rounded-lg transition-colors" title="Upload Image">
                                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                  </button>
                                                  <input #fileCarousel type="file" (change)="onImageUploaded($event, item, 'image_url')" class="hidden" accept="image/*">
                                              </div>
                                              <div *ngIf="item.image_url" class="p-2 border rounded-lg bg-secondary-50 flex items-center gap-2">
                                                  <img [src]="getImageUrl(item.image_url)" class="h-10 w-10 object-cover rounded shadow-sm">
                                                  <span class="text-[10px] text-secondary-400 truncate flex-1">{{ item.image_url }}</span>
                                              </div>
                                          </div>
                                          <div><label class="block text-xs font-bold text-secondary-500 mb-1">Title (Supports HTML)</label><input type="text" [(ngModel)]="item.title" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"></div>
                                      </div>
                                      <div class="space-y-4">
                                          <div><label class="block text-xs font-bold text-secondary-500 mb-1">Subtitle</label><input type="text" [(ngModel)]="item.subtitle" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20"></div>
                                          <div class="grid grid-cols-2 gap-2">
                                              <div><label class="block text-xs font-bold text-secondary-500 mb-1">Button Text</label><input type="text" [(ngModel)]="item.button_text" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20"></div>
                                              <div><label class="block text-xs font-bold text-secondary-500 mb-1">Link</label><input type="text" [(ngModel)]="item.link" class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="/shop"></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <button (click)="addItem('carousel')" class="w-full py-6 border-2 border-dashed border-secondary-200 rounded-2xl text-secondary-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all font-bold flex items-center justify-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                                  </svg>
                                  Add New Slide
                              </button>
                          </div>
                      </div>

                      <!-- PRODUCT GRID FORM -->
                      <div *ngIf="editData.section_type === 'product_grid'" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Header Span</label><input type="text" [(ngModel)]="parsedConfig.header" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none"></div>
                            <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Limit (Items)</label><input type="number" [(ngModel)]="parsedConfig.limit" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none"></div>
                        </div>
                        <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Main Title</label><input type="text" [(ngModel)]="parsedConfig.title" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"></div>
                      </div>

                      <!-- CTA FORM -->
                      <div *ngIf="editData.section_type === 'cta'" class="space-y-4">
                        <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Title</label><input type="text" [(ngModel)]="parsedConfig.title" class="w-full px-3 py-2 border rounded-lg"></div>
                        <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Description</label><textarea [(ngModel)]="parsedConfig.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea></div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Button Text</label><input type="text" [(ngModel)]="parsedConfig.btn_text" class="w-full px-3 py-2 border rounded-lg"></div>
                            <div><label class="block text-xs font-bold text-secondary-500 mb-1 font-bold uppercase tracking-tight">Input Placeholder</label><input type="text" [(ngModel)]="parsedConfig.placeholder" class="w-full px-3 py-2 border rounded-lg"></div>
                        </div>
                      </div>

                      <!-- CAT GRID FORM -->
                      <div *ngIf="editData.section_type === 'categories'" class="space-y-4">
                          <div class="grid grid-cols-2 gap-4">
                              <div><label class="block text-xs font-bold text-secondary-500 mb-1 uppercase tracking-tight">Header Span</label><input type="text" [(ngModel)]="parsedConfig.header" class="w-full px-3 py-2 border rounded-lg"></div>
                              <div><label class="block text-xs font-bold text-secondary-500 mb-1 uppercase tracking-tight">Main Title</label><input type="text" [(ngModel)]="parsedConfig.title" class="w-full px-3 py-2 border rounded-lg font-bold"></div>
                          </div>
                      </div>

                      <!-- BENEFITS FORM -->
                      <div *ngIf="editData.section_type === 'benefits'" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div><label class="block text-xs font-bold text-secondary-500 mb-1 uppercase tracking-tight">Header Span</label><input type="text" [(ngModel)]="parsedConfig.header" class="w-full px-3 py-2 border rounded-lg"></div>
                            <div><label class="block text-xs font-bold text-secondary-500 mb-1 uppercase tracking-tight font-bold">Main Title (Supports HTML)</label><input type="text" [(ngModel)]="parsedConfig.title" class="w-full px-3 py-2 border rounded-lg"></div>
                        </div>
                         <div>
                            <label class="block text-xs font-bold text-secondary-500 mb-1 uppercase tracking-tight">Decorative Image URL / Upload</label>
                            <div class="flex gap-2 mb-2">
                                <input type="text" [(ngModel)]="parsedConfig.image_url" class="flex-1 px-3 py-2 border rounded-lg text-sm bg-white" placeholder="URL or select file">
                                <button (click)="fileBenefits.click()" class="bg-secondary-100 hover:bg-secondary-200 p-2 rounded-lg transition-colors" title="Upload Image">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                </button>
                                <input #fileBenefits type="file" (change)="onImageUploaded($event, parsedConfig, 'image_url')" class="hidden" accept="image/*">
                            </div>
                            <div *ngIf="parsedConfig.image_url" class="p-2 border rounded-lg bg-secondary-50 flex items-center gap-2">
                                <img [src]="getImageUrl(parsedConfig.image_url)" class="h-10 w-10 object-cover rounded shadow-sm">
                                <span class="text-[10px] text-secondary-400 truncate flex-1 font-mono uppercase tracking-tighter">{{ parsedConfig.image_url }}</span>
                            </div>
                         </div>
                         
                         <p class="font-bold border-b pb-1 text-secondary-900 flex justify-between items-center text-sm">
                            <span>Usage Points (Icons + Text)</span>
                            <button (click)="addItem('benefits_usage')" class="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-md hover:bg-primary-100 transition-colors uppercase font-bold tracking-tight">+ Add Point</button>
                         </p>
                         <div *ngFor="let use of parsedConfig.usage_items; let i = index" class="flex gap-2 bg-secondary-50 p-2 rounded-xl group transition-all">
                             <input type="text" [(ngModel)]="use.icon" class="w-16 px-2 py-1 border rounded-lg text-center" placeholder="Icon">
                             <input type="text" [(ngModel)]="use.text" class="flex-1 px-2 py-1 border rounded-lg" placeholder="Usage description">
                             <button (click)="removeItem(parsedConfig.usage_items, i)" class="text-secondary-300 hover:text-red-500 transition-colors px-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></button>
                         </div>

                         <div class="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-100 italic">
                             <div><label class="block text-xs font-bold text-secondary-400 uppercase tracking-tight mb-1">CTA Label</label><input type="text" [(ngModel)]="parsedConfig.cta_text" class="w-full px-3 py-2 border rounded-lg bg-secondary-50"></div>
                             <div><label class="block text-xs font-bold text-secondary-400 uppercase tracking-tight mb-1">CTA Destination</label><input type="text" [(ngModel)]="parsedConfig.cta_link" class="w-full px-3 py-2 border rounded-lg bg-secondary-50"></div>
                         </div>
                      </div>

                  </div>

                  <!-- JSON Mode fallback -->
                  <div *ngIf="jsonMode" class="h-full flex flex-col">
                      <label class="block text-sm font-medium text-secondary-700 mb-1">Configuration (JSON Editor)</label>
                      <textarea [(ngModel)]="editData.configuration" rows="18" class="flex-1 w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 font-mono text-sm leading-relaxed bg-secondary-900 text-secondary-50 selection:bg-primary-500/30" placeholder='{ "key": "value" }'></textarea>
                  </div>
              </div>

              <div class="p-6 border-t border-secondary-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                  <button (click)="isEditing = false" class="px-6 py-2.5 border border-secondary-200 rounded-xl hover:bg-secondary-50 text-secondary-600 font-medium transition-all">Cancel</button>
                  <button (click)="saveSection()" [disabled]="isSaving" class="px-8 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all font-bold disabled:bg-secondary-200 disabled:shadow-none min-w-[140px]">
                    <span *ngIf="!isSaving">{{ selectedSection?.id ? 'Update Section' : 'Add Section' }}</span>
                    <span *ngIf="isSaving" class="flex items-center gap-2 justify-center">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                    </span>
                  </button>
              </div>
          </div>
       </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input, textarea, select { @apply transition-all duration-200; }
  `]
})
export class AdminHomeComponent implements OnInit {
  sections: HomeSection[] = [];
  isEditing = false;
  isSaving = false;
  selectedSection: HomeSection | null = null;
  editData: any = {};
  
  // Dynamic Form State
  jsonMode = false;
  parsedConfig: any = {};

  message = '';
  messageType: 'success' | 'error' = 'success';
  error = '';

  constructor(
    private generalService: GeneralService,
    private contentService: ContentService
  ) {}

  // Drag and Drop
  draggedIndex: number | null = null;
  dropIndex: number | null = null;

  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Enable drop
  }

  onDragEnter(index: number): void {
    this.dropIndex = index;
  }

  onDragEnd(): void {
    if (this.draggedIndex !== null && this.dropIndex !== null && this.draggedIndex !== this.dropIndex) {
      const movedItem = this.sections.splice(this.draggedIndex, 1)[0];
      this.sections.splice(this.dropIndex, 0, movedItem);
      this.reorderSections();
    }
    this.draggedIndex = null;
    this.dropIndex = null;
  }

  private reorderSections(): void {
    // Update local order values
    this.sections.forEach((s, i) => s.order = i);
    
    // Save new order to backend (batch update would be better, but we'll do sequential for now if the API doesn't support batch)
    this.sections.forEach(s => {
      this.generalService.updateHomeSection(s.id, { order: s.order }).subscribe();
    });
    this.showMessage('Order updated successfully!');
  }

  ngOnInit(): void {
    this.loadSections();
  }

  loadSections(): void {
    this.generalService.getHomeSections().subscribe({
      next: (sections) => this.sections = sections,
      error: (err) => this.showMessage('Error loading sections. Please check if the database table exists.', 'error')
    });
  }

  showMessage(msg: string, type: 'success' | 'error' = 'success'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }

  onTypeChange(): void {
      // Re-initialize parsedConfig if switching types to avoid layout crashes
      this.initEmptyConfig(this.editData.section_type);
  }

  private initEmptyConfig(type: string): void {
      switch(type) {
          case 'hero':
              this.parsedConfig = { 
                  title: '', subtitle: '', description: '', 
                  primary_btn_text: '', primary_btn_link: '', 
                  secondary_btn_text: '', secondary_btn_link: '', 
                  image_url: '', bg_image_url: '' 
              };
              break;
          case 'carousel':
              this.parsedConfig = { items: [], autoplay: true, interval: 5000 };
              this.addItem('carousel');
              break;
          case 'features':
              this.parsedConfig = { header: '', title: '', subtitle: '', features: [] };
              this.addItem('features');
              break;
          case 'categories':
              this.parsedConfig = { header: '', title: '', categories: [] };
              break;
          case 'benefits':
              this.parsedConfig = { 
                  header: '', title: '', image_url: '', 
                  points: [], usage_title: '', usage_items: [], 
                  cta_text: '', cta_link: '' 
              };
              this.addItem('benefits_usage');
              break;
          case 'product_grid':
              this.parsedConfig = { header: '', title: '', limit: 4 };
              break;
          case 'cta':
              this.parsedConfig = { title: '', description: '', placeholder: '', btn_text: '' };
              break;
          default:
              this.parsedConfig = {};
      }
  }

  addItem(type: string): void {
      if (type === 'carousel') {
          if (!this.parsedConfig.items) this.parsedConfig.items = [];
          this.parsedConfig.items.push({ image_url: '', title: '', subtitle: '', link: '', button_text: '' });
      } else if (type === 'features') {
          if (!this.parsedConfig.features) this.parsedConfig.features = [];
          this.parsedConfig.features.push({ icon: '✨', title: '', description: '' });
      } else if (type === 'benefits_usage') {
          if (!this.parsedConfig.usage_items) this.parsedConfig.usage_items = [];
          this.parsedConfig.usage_items.push({ icon: '✅', text: '' });
      }
  }

  removeItem(array: any[], index: number): void {
      array.splice(index, 1);
  }

  onImageUploaded(event: any, target: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      this.contentService.uploadMedia(file).subscribe({
        next: (res) => {
          target[field] = res.url;
          this.showMessage('Image uploaded successfully!');
        },
        error: (err) => {
          this.error = 'Upload failed: ' + (err.error?.detail || err.message);
          this.showMessage('Image upload failed', 'error');
        }
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  createNewSection(): void {
    this.selectedSection = null;
    this.error = '';
    this.jsonMode = false;
    this.editData = {
      title: 'New Section',
      section_type: 'hero',
      order: this.sections.length,
      is_active: true
    };
    this.initEmptyConfig('hero');
    this.isEditing = true;
  }

  editSection(section: HomeSection): void {
    this.selectedSection = section;
    this.error = '';
    this.editData = { ...section };
    this.jsonMode = false;
    
    try {
        if (section.configuration) {
            if (typeof section.configuration === 'string') {
                this.parsedConfig = JSON.parse(section.configuration);
            } else if (section.configuration && typeof section.configuration === 'object') {
                this.parsedConfig = { ...(section.configuration as any) };
            } else {
                this.parsedConfig = {};
            }
            
            // Re-stringify for JSON mode fallback
            this.editData.configuration = JSON.stringify(this.parsedConfig, null, 2);
        } else {
            this.initEmptyConfig(section.section_type);
        }
    } catch(e) {
        console.error('Error parsing section config, falling back to JSON mode', e);
        this.jsonMode = true;
        this.parsedConfig = {};
    }
    
    this.isEditing = true;
  }

  saveSection(): void {
    this.error = '';
    
    // Sync UI form to configuration string
    if (!this.jsonMode) {
        this.editData.configuration = JSON.stringify(this.parsedConfig);
    }

    // Validation
    try {
      if (this.editData.configuration) {
        JSON.parse(this.editData.configuration);
      }
    } catch(e) {
      this.error = 'Invalid JSON state. Please switch to Simple UI or fix JSON.';
      return;
    }

    this.isSaving = true;
    const request = this.selectedSection 
        ? this.generalService.updateHomeSection(this.selectedSection.id, this.editData)
        : this.generalService.createHomeSection(this.editData);

    request.subscribe({
        next: () => {
          this.isSaving = false;
          this.isEditing = false;
          this.loadSections();
          this.showMessage(this.selectedSection ? 'Section updated successfully!' : 'New section created successfully!');
        },
        error: (err) => {
          this.isSaving = false;
          this.error = 'Server Error: ' + (err.error?.detail || err.message);
        }
    });
  }

  updateOrder(section: HomeSection): void {
      this.generalService.updateHomeSection(section.id, { order: section.order }).subscribe({
        error: () => this.showMessage('Failed to update order.', 'error')
      });
  }

  toggleActive(section: HomeSection): void {
      section.is_active = !section.is_active;
      this.generalService.updateHomeSection(section.id, { is_active: section.is_active }).subscribe({
        error: () => {
          section.is_active = !section.is_active;
          this.showMessage('Failed to toggle status.', 'error');
        }
      });
  }

  deleteSection(section: HomeSection): void {
    if (confirm('Are you sure you want to delete this section?')) {
      this.generalService.deleteHomeSection(section.id).subscribe({
        next: () => {
          this.loadSections();
          this.showMessage('Section deleted successfully!');
        },
        error: () => this.showMessage('Failed to delete section.', 'error')
      });
    }
  }
}
