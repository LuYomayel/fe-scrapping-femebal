import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './table/table.component';
import { FairPlayComponent } from './fairplay/fairplay.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { CafecitoComponent } from './cafecito/cafecito.component';
const routes: Routes = [
  { path: '', redirectTo: 'goleadores/torneo/2023/CLAUSURA', pathMatch: 'full' },
  { path: 'goleadores/torneo/:year/:tipo', component: TableComponent },
  { path: 'fairplay/torneo/:year/:tipo', component: FairPlayComponent },
  { path: 'estadisticas', component: StatisticsComponent },
  { path: 'cafecito', component: CafecitoComponent },
  { path: '**', redirectTo: 'goleadores/torneo/2023/CLAUSURA' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
