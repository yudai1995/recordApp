import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { recordComponent } from './record/record.component';
import { RecordDatailComponent } from './record-datail/record-datail.component';
import { HistoryComponent } from './history/history.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'list', component: recordComponent },
  { path: 'detail/:id', component: RecordDatailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'setting', component: SettingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
