import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntdModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormPengajuanKlaimComponent } from './components/pengajuan_klaim/form-pengajuan-klaim/form-pengajuan-klaim.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './components/pengajuan_klaim/dashboard/dashboard.component';
import { DokumenKlaimComponent } from './components/pengajuan_klaim/dokumen-klaim/dokumen-klaim.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FormPengajuanKlaimComponent,
    DashboardComponent,
    DokumenKlaimComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NzLayoutModule,
    DemoNgZorroAntdModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
