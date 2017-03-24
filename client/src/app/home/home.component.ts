import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';
import { MovieService } from '../services/movie.service';
import { GenreService } from '../services/genre.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  genres: Genre;
  movies: Movie[];

  constructor(
        private GenService: GenreService,
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  ngOnInit() {
    this.MovService.getTopMovies()
    .then(res => this.movies = res);
    }
}