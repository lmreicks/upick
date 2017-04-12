import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'now-playing',
  templateUrl: './now-playing.component.html'
})

export class NowPlayingComponent implements OnInit {
  movies: Movie[];

  constructor(
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  ngOnInit() {
    this.MovService.getNowPlaying()
    .then(res => this.movies = res);
    }
}