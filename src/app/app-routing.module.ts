import { SustainComponent } from './sustain/sustain.component';
import { SustainAdComponent } from './sustain-ad/sustain-ad.component';
import { ListComponent } from './list/list.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { CatanComponent } from './catan/catan.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'sustain', redirectTo: '/support', pathMatch: 'full' },
  { path: 'sustainAd', redirectTo: '/supportAd', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'list/:list', component: ListComponent },
  { path: 'list', component: ListComponent },
  { path: 'supportAd', component: SustainAdComponent },
  { path: 'support', component: SustainComponent },
  { path: 'faq', component: FaqComponent },
  //{
  //  path: 'catan2024',
  //  component: CatanComponent
  //}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
