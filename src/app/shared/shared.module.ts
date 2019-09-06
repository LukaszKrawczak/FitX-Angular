import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatSelectModule, MatProgressBarModule, MatToolbarModule} from '@angular/material';
import {SelectModule} from 'ng2-select';
import {ToastrModule} from 'ngx-toastr';
import {RouterModule} from '@angular/router';

import {AdsenseTopComponent} from './components/adsense-top/adsense-top.component';
import {ResponsiveComponent} from './components/responsive/responsive.component';
import {DropdownListComponent} from './components/dropdown-list/dropdown-list.component';
import {CalendarComponent} from './components/calendar/calendar.component';

import {FilterProductPipe} from './pipes/filterProduct.pipe';

import {UserService} from './services/user.service';
import {AuthService} from './services/auth.service';
import {ImageUploadService} from './services/image-upload.service';
import {MealsHours} from './services/meals-hours.service';

@NgModule({
  declarations: [
    AdsenseTopComponent,
    ResponsiveComponent,
    DropdownListComponent,
    CalendarComponent,

    FilterProductPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatToolbarModule,
    SelectModule,
    RouterModule,

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
  exports: [
    AdsenseTopComponent,
    ResponsiveComponent,
    DropdownListComponent,
    CalendarComponent,

    FilterProductPipe,

    CommonModule,
    NgbModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatToolbarModule,
    SelectModule
  ],
  providers: [
    UserService,
    AuthService,
    ImageUploadService,
    MealsHours
  ]
})

export class SharedModule {
}
