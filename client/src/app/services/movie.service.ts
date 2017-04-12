import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Movie } from '../models/movie.model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
  private baseUrl = 'http://lexireicks.com/upick/api/';

  constructor(private http: Http) { };

  getMoviesByGenre(id: number, pageNumber: number): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'genre/' + id + '/movies/' + pageNumber)
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
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
      .then(function (res) {
        console.log(res.json());
        return res.json();
      }, function (err) {
        return err;
      });
  }

  getTest(id: number): Promise<Movie> {
    return this.http.get(this.baseUrl + 'test/' + id)
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
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
}