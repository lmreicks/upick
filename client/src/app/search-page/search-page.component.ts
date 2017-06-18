import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.model';
import 'rxjs/add/operator/toPromise';

@Component({
	selector: 'search-page',
	templateUrl: 'search-page.component.html',
	styleUrls: ['search-page.component.less']
})

export class SearchPageComponent implements OnInit {
	query: string;
	movies: Movie[];

	constructor(
    private MovService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

	ngOnInit() {
		this.route.queryParams.subscribe(param => {
			this.query = param['query'];
			this.MovService.movieSearchPage(param['query']).then(res => this.movies = res);
		});
	}
}