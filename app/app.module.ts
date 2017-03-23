import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { GenreComponent } from './genre-list/genre-list.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component';

import { CategoryService } from './services/categories.service';
import { GenreService } from './services/genre.service';
import { MovieService } from './services/movie.service';
import { routing, appRoutingProviders } from './app.routing';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, routing ],
  declarations: [ AppComponent, HomeComponent, MovieComponent, CategoryListComponent, GenreComponent, GenreDetailsComponent, CategoryDetailsComponent],
  providers:    [ GenreService, CategoryService, MovieService, appRoutingProviders, GenreService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
