import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { PacketComponent } from './packet/packet.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchComponent } from './search/search.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { RatingsComponent } from './ratings/ratings.component';

export const routes: Routes = [
  { path: 'packet-component', component: PacketComponent },
  { path: 'user-component', component: UserComponent },
  { path: 'register-component', component: RegisterFormComponent },
  { path: 'ratings-component', component: RatingsComponent }, 
  { path: 'search', component: SearchComponent },
  { path: '', redirectTo: '/user-component', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];