import { ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieComponent } from './movie/movie.component';
import { CategoryListComponent } from './category-list/category-list.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/category-list', pathMatch: 'full' },
  { path: 'movie/:id', component: MovieComponent},
  { path: 'category-list', component: CategoryListComponent}
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);