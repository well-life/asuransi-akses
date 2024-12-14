import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormPengajuanKlaimComponent } from './components/pengajuan_klaim/form-pengajuan-klaim/form-pengajuan-klaim.component';
import { DashboardComponent } from './components/pengajuan_klaim/dashboard/dashboard.component';
import { DokumenKlaimComponent } from './components/pengajuan_klaim/dokumen-klaim/dokumen-klaim.component';
import { EditKlaimComponent } from './components/pengajuan_klaim/edit-klaim/edit-klaim.component';
import { HistoryPengajuanComponent } from './components/history-pengajuan/history-pengajuan.component';
import { AuthGuard } from './components/auth/guards/auth.guard';


const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', component: LoginComponent, canActivate: [AuthGuard] }, // Gunakan guard di sini
  { path: 'login', redirectTo: '' },
  { path: 'form_pengajuan', component: FormPengajuanKlaimComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history-pengajuan', component: HistoryPengajuanComponent },
  { path: 'klaim/:id', component: DokumenKlaimComponent },
  { path: 'edit-claim/:id', component: EditKlaimComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
