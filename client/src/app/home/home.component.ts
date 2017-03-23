import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieList } from '../models/movie-list.model';
import { Genres } from '../models/genre.model';
import { MovieService } from '../services/movie.service';
import { GenreService } from '../services/genre.service';
import { Movie } from '../models/movie.model';

import 'rxjs/add/operator/switchMap';

@Component({
	moduleId: module.id,
	selector: 'home',
	templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {

	constructor(
        private GenService: GenreService,
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  	genres: Genres;
  	movies: any[];

	ngOnInit() { 
		this.MovService.getTopMovies()
		.then(res => this.movies = res);
	}
}