import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormPengajuanKlaimComponent } from './components/pengajuan_klaim/form-pengajuan-klaim/form-pengajuan-klaim.component';
import { DashboardComponent } from './components/pengajuan_klaim/dashboard/dashboard.component';
import { DokumenKlaimComponent } from './components/pengajuan_klaim/dokumen-klaim/dokumen-klaim.component';

const routes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: '', component: LoginComponent},
  {path: 'login', redirectTo: ''},
  {path: 'form_pengajuan', component: FormPengajuanKlaimComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'klaim/:id', component: DokumenKlaimComponent }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
