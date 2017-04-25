import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BusyModule } from 'angular2-busy';

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { MovieDetailResolver } from './services/movie-detail.resolve.service';
import { GenreComponent } from './genre-list/genre-list.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { PageNotFound } from './404/notfound.component';

import { GenreService } from './services/genre.service';
import { MovieService } from './services/movie.service';
import { routing, appRoutingProviders } from './app.routing';
import { SearchComponent } from './search/search.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { RecommendationSliderComponent } from './recommendation-slider/recommendation-slider.component';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, routing, ChartsModule, FormsModule, ReactiveFormsModule,
                BrowserAnimationsModule, BusyModule ],
  declarations: [ AppComponent, HomeComponent, MovieComponent, GenreComponent, GenreDetailsComponent, NowPlayingComponent,
                  PageNotFound, SearchComponent, ClickOutsideDirective, RecommendationSliderComponent ],
  providers:    [ GenreService, MovieService, appRoutingProviders, GenreService, MovieDetailResolver ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
