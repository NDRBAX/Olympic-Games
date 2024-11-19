import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'details', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'details',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsModule),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: HomeComponent,
  },
  {
    path: '**', // wildcard
    //component: NotFoundComponent,
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
