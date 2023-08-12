import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './table/table.component';
import { FairPlayComponent } from './fairplay/fairplay.component';
const routes: Routes = [
  { path: 'goleadores/torneo/:year/:tipo', component: TableComponent },
  { path: 'fairplay/torneo/:year/:tipo', component: FairPlayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
