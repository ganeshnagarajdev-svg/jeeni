import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list';
import { BlogDetailsComponent } from './blog-details/blog-details';
import { GalleryComponent } from './gallery/gallery';

const routes: Routes = [
  { path: 'blogs', component: BlogListComponent },
  { path: 'blogs/:slug', component: BlogDetailsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: '', redirectTo: 'blogs', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
