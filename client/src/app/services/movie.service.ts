import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Movie } from '../models/movie.model';
import { CoreCacheService } from './core-cache.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class MovieService {
  private baseUrl = 'http://lexireicks.com/upick/api/';
  private data = new ReplaySubject<Movie[]>();
  IsQueryInProgress = false;

  constructor(private http: Http) { };

  getMoviesByGenre(id: number, pageNumber: number, force: boolean = false, queryParams?: any) {
      if (this.data.observers.length || force) {
        this.http.get(this.baseUrl + 'genre/' + id + '/movies/' + pageNumber + queryParams)
        .subscribe(
          data => {
          this.IsQueryInProgress = true;
          this.data.next(data.json());
      }, error => {
        this.data.error(error);
        this.data = new ReplaySubject<Movie[]>();
      });
    }
    return this.data;
  }

  getRandom(): Promise<Movie> {
    return this.http.get(this.baseUrl + 'movies/random')
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
  }

  getMoreInfo(id: number): Promise<Movie> {
    return this.http.get(this.baseUrl + 'movies/' + id + '/more')
      .toPromise()
      .then(res => {
        return res.json();
      }, err => {
        return err;
      });
  }

  getTrailer(movieId: String) {
    return this.http.get(this.baseUrl + '/movies/' + movieId + '/trailer')
      .toPromise()
      .then(res => {
        return res.json();
      }, err => {
        return err;
      })
  }

  getRandomMovieByGenre(id: number): Promise<Movie> {
    return this.http.get(this.baseUrl + 'genre/' + id + '/random')
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
  }

  getTopMovies(): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'movies/top')
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
  }

  getNowPlaying(): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'movies/nowplaying')
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
  }

  movieSearch(query: string): Observable<Array<Movie>> {
    return this.http.get(this.baseUrl + 'movies/search?query=' + query)
            .map((res) => res.json());
  }

  movieSearchPage(query: string): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'movies/search?query=' + query)
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
  }

  pickThree(movies: Movie[]): Promise<Movie[]> {
    return this.http.post(this.baseUrl + 'movies/pick-three', movies)
      .toPromise()
      .then(res => {
        console.log(res.json());
        return res.json();
      }, err => {
        return err;
      });
  }
}
