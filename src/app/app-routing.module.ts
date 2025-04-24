import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TablePageComponent } from './table-page/table-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'landingpage', pathMatch: 'full' },
  { path: 'landingpage', component: LandingPageComponent }, 
  { path: 'tablepage', component: TablePageComponent }, 
  { path: '**', redirectTo: 'landingpage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
