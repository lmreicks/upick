import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import 'chart.js';

import { Movie } from '../models/movie.model';
import { Chart } from '../models/chart.model';
import { Genre } from '../models/genre.model';
import { genreLookup } from '../models/genrelookup.model';
import { GenreService } from '../services/genre.service';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery';
import 'slick-carousel';

@Component({
  moduleId: module.id,
  selector: 'movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.less'],
})
export class MovieComponent implements OnInit, OnDestroy {

  movie: Movie = new Movie();
  chart: Chart = new Chart();
  genre: Genre = new Genre();

  baseUrl = 'https://www.youtube.com/embed/';
  url: SafeResourceUrl;
  trailer = false;
  slider = false;

  gomovies: any;
  urltitle: any;
  isRandom: boolean;
  genreId: boolean;

  imdbdata: any;
  rottendata: any;

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    this.route.queryParams.subscribe(param => this.genre.id = +param['random']);
    this.genre.name = genreLookup.get(this.genre.id);
    // use genre id to get name

    let id;
    this.route.params.subscribe(res => {
      id = res['id'];
      this.MovService.getMoreInfo(id).then(movie => {
        this.movie = movie;
        this.rottendata = null;
        if (this.movie.rotten_tomatoes && this.movie.rotten_tomatoes.length > 0 && parseInt(this.movie.rotten_tomatoes) > 0) {
          this.rottendata = [100 - parseInt(this.movie.rotten_tomatoes), parseInt(this.movie.rotten_tomatoes)];
        }
        if (this.movie.imdb_rating && this.movie.imdb_rating > 0) {
          this.imdbdata = [10 - this.movie.imdb_rating, this.movie.imdb_rating];
        }

        this.gomovies = 'https://gomovies.to/film/' +
                        this.movie.title.toLowerCase().replace(/ /g, '\-') + '-' + this.movie.gomovies_id;
      });
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

  LoadTrailer() {
    if (!this.url || this.url === null) {
      this.MovService.getTrailer(this.movie.id).then(trailerId => {
        this.trailer = true;
        trailerId = trailerId.substring(1, trailerId.length - 1);
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + trailerId);
      });
    }
  this.trailer = !this.trailer;
}

ngOnDestroy() {
  this.trailer = false;
  this.url = null;
  this.movie = null;
  this.chart = null;
}

}
