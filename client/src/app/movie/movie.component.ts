import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import 'chart.js';

import { Movie } from '../models/movie.model';
import { Chart } from '../models/chart.model';
import { Genre } from '../models/genre.model';
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
export class MovieComponent implements OnInit {

  movie: Movie = new Movie();
  chart: Chart = new Chart();
  genre: Genre = new Genre();

  baseUrl: string = 'https://www.youtube.com/embed/';
  url: SafeResourceUrl;
  trailer: boolean = false;
  slider: boolean = false;

  gomovies: any;
  urltitle: any;
  isRandom: boolean;
  genreId: boolean;

  imdbdata: any;
  rottendata: any;
  busy: Promise<any>;

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  //add a splash screen until all of the information is loaded

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    this.route.params.subscribe(res => this.genre.id = res['genreId']);
    this.route.params.subscribe(res => this.genre.name = res['genreName']);
// gets the data from movie-detail resolver as movie, subscribes it to this instance of movie
    let id;
    this.route.params.subscribe(res => {
      id = res['id'];
      this.busy = this.MovService.getMoreInfo(id).then(movie => {
        this.movie = movie;
        this.loadFrame(this.movie.trailer_url);
        if (this.movie.rotten_tomatoes) {
          this.rottendata = [100 - parseInt(this.movie.rotten_tomatoes), parseInt(this.movie.rotten_tomatoes)];
        }
        if (this.movie.imdb_rating) {
          this.imdbdata = [10 - this.movie.imdb_rating, this.movie.imdb_rating];
        }

        this.gomovies = 'https://gomovies.to/film/' +
                        this.movie.title.toLowerCase().replace(/ /g, '\-') + '-' + this.movie.gomovies_id;
      });
    });

      
      /*
      this.busy = this.route.data
          .subscribe((data: { movie: Movie }) => {
              this.movie = data.movie;

              this.loadFrame(this.movie.trailer_url);
              if (this.movie.rotten_tomatoes) {
                this.rottendata = [100 - parseInt(this.movie.rotten_tomatoes), parseInt(this.movie.rotten_tomatoes)];
              }
              if (this.movie.imdb_rating) {
                this.imdbdata = [10 - this.movie.imdb_rating, this.movie.imdb_rating];
              }

              this.gomovies = 'https://gomovies.to/film/' +
                              this.movie.title.toLowerCase().replace(/ /g, '\-') + '-' + this.movie.gomovies_id;

*/
  }

  loadFrame(id: String) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + id);
  }

}