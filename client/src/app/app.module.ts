import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
<<<<<<< HEAD
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
=======
import { BusyModule } from 'angular2-busy';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
>>>>>>> 07f93298c8e728c8225174ff6cc7626dfcdc9933

import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { MovieComponent } from './movie/movie.component';
import { MovieDetailResolver } from './services/movie-detail.resolve.service';
import { GenreComponent } from './genre-list/genre-list.component';
import { GenreDetailsComponent } from './genre-details/genre-details.component';
import { NowPlayingComponent } from './now-playing/now-playing.component';
import { PickThreeComponent } from './pick-three/pick-three.component';
import { PageNotFound } from './404/notfound.component';

import { GenreService } from './services/genre.service';
import { MovieService } from './services/movie.service';
import { CoreCacheService } from './services/core-cache.service';
import { routing, appRoutingProviders } from './app.routing';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { RecommendationSliderComponent } from './shared/recommendation-slider/recommendation-slider.component';
import { SliderComponent } from './shared/slider/slider.component';
import { DragDirective } from './shared/slider/slider.directive';
import { ToolTipModule } from 'angular2-tooltip'
import { Slider2Component } from './shared/slider2/slider2.component';

@NgModule({
<<<<<<< HEAD
  imports:      [
    BrowserModule,
    HttpModule,
    JsonpModule,
    routing,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    ToolTipModule,
    NgbModule.forRoot()
    ],
  declarations: [
    AppComponent,
    HomeComponent,
    MovieComponent,
    GenreComponent,
    GenreDetailsComponent,
    NowPlayingComponent,
    PageNotFound,
    PickThreeComponent,
    SearchBarComponent,
    ClickOutsideDirective,
    RecommendationSliderComponent,
    SearchPageComponent,
    SliderComponent,
    DragDirective,
    Slider2Component
    ],
  providers:    [
    GenreService,
    MovieService,
    CoreCacheService,
    appRoutingProviders,
    GenreService,
    MovieDetailResolver
    ],
=======
  imports:      [BrowserModule, HttpModule, JsonpModule, routing, ChartsModule, FormsModule,
                ReactiveFormsModule, BrowserAnimationsModule, BusyModule, NgbModule.forRoot(),
                Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]) ],
  declarations: [ AppComponent, HomeComponent, MovieComponent, GenreComponent, GenreDetailsComponent, NowPlayingComponent,
                  PageNotFound, SearchComponent, ClickOutsideDirective, RecommendationSliderComponent ],
  providers:    [ GenreService, MovieService, appRoutingProviders, GenreService, MovieDetailResolver],
>>>>>>> 07f93298c8e728c8225174ff6cc7626dfcdc9933
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
