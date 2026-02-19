import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareersListComponent } from './careers-list/careers-list';
import { PageViewerComponent } from './page-viewer/page-viewer';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery';
import { VideoGalleryComponent } from './video-gallery/video-gallery';
import { ContactUsComponent } from './contact-us/contact-us';
import { AboutUsComponent } from './about-us/about-us';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'careers', component: CareersListComponent },
  { path: 'pages/contact-us', component: ContactUsComponent },
  { path: 'pages/about-us', component: AboutUsComponent },
  { path: 'pages/:slug', component: PageViewerComponent },
  { path: 'photo-gallery', component: PhotoGalleryComponent },

  { path: 'video-gallery', component: VideoGalleryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }

