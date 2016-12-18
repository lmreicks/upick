import { Component } from '@angular/core';

import { Movie } from '../models/movie.model';

@Component({
  moduleId: module.id,
  selector: 'movie',
  templateUrl: 'movie.component.html',
  styleUrls: ['movie.component.css']
})
export class MovieComponent { 
  constructor() {

  }

  movie: Movie;
}