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
  steps: any = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6', 'Step 7', 'Step 8', 'Step 9', 'Step 10', 'Step 11', 'Step 13'];

  constructor(
        private GenService: GenreService,
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  ngOnInit() {
    this.MovService.getTopMovies().then(res => this.movies = res);
    }
}
