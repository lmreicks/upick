import { ModuleWithProviders} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component';
import { GenreComponent} from './genre-list/genre-list.component';
import { PageNotFound } from './404/notfound.component';


const appRoutes: Routes = [
  // list of top most popular movies
  { path: '', redirectTo: 'top', pathMatch: 'full'},
  { path: 'top', component: HomeComponent },
  { path: 'nowplaying', component: NowPlayingComponent },
  // random movie in that genre, genre title and movie id
  { path: 'movie/:id', component: MovieComponent },
  // list of all movies in that genre using genre id
  { path: 'genre/:genre/:id', component: GenreDetailsComponent},
  // list of all genres
  { path: 'genre', component: GenreComponent},
  // { path: '404', component: PageNotFound},
  // {path: '**', redirectTo: '/404'}
]

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);