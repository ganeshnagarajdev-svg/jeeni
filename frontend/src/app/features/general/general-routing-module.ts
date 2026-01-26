import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareersListComponent } from './careers-list/careers-list';
import { PageViewerComponent } from './page-viewer/page-viewer';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'careers', component: CareersListComponent },
  { path: 'pages/:slug', component: PageViewerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
