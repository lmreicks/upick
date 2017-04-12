import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { GenreComponent } from './genre-list/genre-list.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { PageNotFound } from './404/notfound.component';

import { GenreService } from './services/genre.service';
import { MovieService } from './services/movie.service';
import { routing, appRoutingProviders } from './app.routing';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, routing, ChartsModule, FormsModule, ReactiveFormsModule ],
  declarations: [ AppComponent, HomeComponent, MovieComponent, GenreComponent, GenreDetailsComponent, NowPlayingComponent, PageNotFound ],
  providers:    [ GenreService, MovieService, appRoutingProviders, GenreService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
