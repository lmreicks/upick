import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { Movie } from '../models/movie.model';
import { GenreService } from '../services/genre.service';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit{
  movie: Movie;
  genreId: number;
  genreName: String;
  movieId:number;
  url:UrlSegment[];

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(res => this.genreId = res['id']);
    this.route.params.subscribe(res => this.genreName = res['genre']);
    this.route.params.subscribe(res => this.movieId = res['id']);
    this.route.url.subscribe(res => this.url = res);
    console.log(this.url[0]);
    if (this.url[0].path === 'genre') {
      this.getRandomFromGenre(this.genreId);
    }
    if (this.url[0].path === 'movie') {
      this.getMovieInfo(this.movieId);
    }

    if (this.url[0].path === 'random') {
      this.getRandomAll();
    }
  }

  getRandomFromGenre(id:number) {
    this.MovService.getRandomMovieByGenre(id).then(res => this.movie = res);
  }

  getMovieInfo(id:number) {
    this.MovService.getMoreInfo(id).then(res => this.movie = res);
  } 

  getRandomAll() {
    this.MovService.getRandom().then(res => this.movie = res);
  }

}

/*accepted
To complement the two previous answers, Angular2 supports both query parameters and path variables within routing. In @RouteConfig definition, if you define parameters within a path, Angular2 handles them as path variables and as query parameters if not.

Let's take a sample:

@RouteConfig([
  { path: '/:id', component: DetailsComponent, name: 'Details'}
])
If you call the navigate method of the router like this:

this.router.navigate( [
  'Details', { id: 'companyId', param1: 'value1'
}]);
*/