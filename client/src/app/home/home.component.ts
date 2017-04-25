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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})

export class HomeComponent implements OnInit {
  genres: Genre;
  movies: Movie[];
  busy: Promise<any>;

  constructor(
        private GenService: GenreService,
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  ngOnInit() {
    this.busy = this.MovService.getTopMovies()
    .then(res => this.movies = res);
    }
}