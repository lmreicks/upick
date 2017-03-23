import { ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component'; 
import { GenreComponent} from './genre-list/genre-list.component';


const appRoutes: Routes = [
  //list of all genres
  { path: '', component: HomeComponent },
  //random genre button // list of genres
  { path: 'genre/random', component: GenreComponent },
  //random movie in that genre, genre title and movie id
  { path: 'genre/random/:genre/:id', component: GenreDetailsComponent},
  //list of all movies in that genre using genre id
  { path: 'genre/:genre/:id', component: GenreDetailsComponent},
  //list of all genres
  { path: 'genre', component: GenreComponent}
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);