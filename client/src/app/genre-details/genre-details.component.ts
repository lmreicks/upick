import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Genre } from '../models/genre.model';
import { CoreCacheService } from '../services/core-cache.service';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.model';
import { Subscription } from 'rxjs';

import 'rxjs';
import { genreLookup } from '../models/genrelookup.model';

@Component({
  moduleId: module.id,
  selector: 'genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.less'],
})

export class GenreDetailsComponent implements /*OnInit,*/ OnChanges {
  @Input() genreId: number;
  movies: Movie[];
  genre: Genre = new Genre();
  page: number;

  constructor(
    private CoreCache: CoreCacheService,
    private MovService: MovieService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnChanges() {
    this.page = 1;
    this.genre.id = this.genreId;
    this.genre.name = genreLookup.get(+this.genre.id);
    console.log(this.genre);
    this.fetchMovies(this.genre.id);
  }

  setPage(page: number) {
    window.scrollTo(0, 0);
    this.page = page;
    this.CoreCache.getMoviesByGenre(this.genre.id, this.page).subscribe(res => {
      console.log(res);
      this.movies = res;
    });
    this.router.navigate([], {
        queryParams: {'page': this.page},
        relativeTo: this.route
    });
  }

  fetchMovies(id: number) {
    this.CoreCache.getMoviesByGenre(this.genre.id, this.page).subscribe(res => {
      console.log(res);
      this.movies = res;
    });
  }

  getRandom() {
    this.MovService.getRandomMovieByGenre(this.genre.id).then(res => {
      this.router.navigate(['movie', res.id],
      { queryParams: {
          'random': this.genre.id
      }});
    });
  }

  getMovieInfo(id: number) {
    let vm = this;

    this.MovService.getMoreInfo(id).then(function (res) {
      vm.router.navigate(['movie', res]);
    });
  }
}
