import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { SustainAdComponent } from './sustain-ad/sustain-ad.component';
import { SustainComponent } from './sustain/sustain.component';

const routes: Routes = [
  { path: '', redirectTo: '/sustainAd', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'list/:list', component: ListComponent },
  { path: 'sustainAd', component: SustainAdComponent },
  { path: 'sustain', component: SustainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
