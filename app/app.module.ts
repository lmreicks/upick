import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { MovieComponent } from './movie/movie.component';
import { CategoryListComponent } from './category-list/category-list.component';

import { CategoryService } from './services/categories.service';
import { MovieService } from './services/movie.service';
import { routing, appRoutingProviders } from './app.routing';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, routing ],
  declarations: [ AppComponent, MovieComponent, CategoryListComponent ],
  providers: [CategoryService, MovieService, appRoutingProviders],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
