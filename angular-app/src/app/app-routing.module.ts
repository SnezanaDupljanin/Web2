import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import {MapComponent} from './map/map.component';
import {PriceListComponent} from './price-list/price-list.component'
import {TimetableComponent} from './timetable/timetable.component'
import { VerifyProfileComponent } from './verify-profile/verify-profile.component';
import { ValidateTicketComponent } from './validate-ticket/validate-ticket.component';
import { CanActivateViaControllerGuard } from './guard/controller.guard';
import { CurrentVehiclesComponent } from './current-vehicles/current-vehicles.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  
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

  { 
    path: 'TimeTable', 
    component: TimetableComponent 
  },

  { 
    path: 'Verify', 
    component: VerifyProfileComponent,
    canActivate: [CanActivateViaControllerGuard]
  },

  { 
    path: 'Validate', 
    component: ValidateTicketComponent,
    canActivate: [CanActivateViaControllerGuard] 
  },

  { 
    path: 'Current', 
    component: CurrentVehiclesComponent 
  },
  {
    path:'Edit',
    component: EditProfileComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


