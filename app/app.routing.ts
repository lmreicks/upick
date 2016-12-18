import { ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieComponent } from './movie/movie.component';
import { CategoryListComponent } from './category-list/category-list.component';


const appRoutes: Routes = [
  { path: 'movie', component: MovieComponent},
  { path: 'category-list', component: CategoryListComponent}
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);