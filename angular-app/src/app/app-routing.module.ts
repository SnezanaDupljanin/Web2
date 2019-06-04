import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import {MapComponent} from './map/map.component';
import {PriceListComponent} from './price-list/price-list.component'

const routes: Routes = [
  {
    path: "",
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { 
    path: 'Login', 
    component: LoginComponent 
  },

  { 
    path: 'Registration', 
    component: RegistrationComponent 
  },
  { 
    path: 'Map', 
    component: MapComponent 
  },
   
  { 
    path: 'PriceList', 
    component: PriceListComponent 
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


