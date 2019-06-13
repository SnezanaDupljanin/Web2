import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
//import { BrowserModule } from '@angular/platform-browser';
//import { NgModule,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NotificationService} from './services/notification.service'

import {CanActivateViaAdminGuard} from './guard/admin.guard';
import {CanActivateViaUserGuard} from './guard/user.guard';
import {CanActivateViaControllerGuard} from './guard/controller.guard';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/interceptor';
import { MapComponent } from './map/map.component';
import { PriceListComponent } from './price-list/price-list.component';
import { TimetableComponent } from './timetable/timetable.component';
import { AgmCoreModule } from '@agm/core';
import { ModalComponent } from './modal/modal.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { VerifyProfileComponent } from './verify-profile/verify-profile.component';
import { ValidateTicketComponent } from './validate-ticket/validate-ticket.component';
import { CurrentVehiclesComponent } from './current-vehicles/current-vehicles.component';
import { HttpClickService } from './services/click-http.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    MapComponent,
    PriceListComponent,
    TimetableComponent,
    ModalComponent,
    EditProfileComponent,
    VerifyProfileComponent,
    ValidateTicketComponent,
    CurrentVehiclesComponent

  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'}),

  ],
  providers: [

  CanActivateViaControllerGuard,
  CanActivateViaUserGuard,
  CanActivateViaAdminGuard,

  NotificationService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  HttpClickService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
