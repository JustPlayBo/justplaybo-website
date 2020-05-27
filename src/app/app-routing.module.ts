import { SustainComponent } from './sustain/sustain.component';
import { SustainAdComponent } from './sustain-ad/sustain-ad.component';
import { ListComponent } from './list/list.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/supportAd', pathMatch: 'full' },
  { path: 'sustain', redirectTo: '/support', pathMatch: 'full' },
  { path: 'sustainAd', redirectTo: '/supportAd', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'list/:list', component: ListComponent },
  { path: 'list', component: ListComponent },
  { path: 'supportAd', component: SustainAdComponent },
  { path: 'support', component: SustainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
