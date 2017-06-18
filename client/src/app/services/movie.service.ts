import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Movie } from '../models/movie.model';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
  private baseUrl = 'http://lexireicks.com/upick/api/';
  movieObservable: Observable<Movie[]>;

  constructor(private http: Http) { };

  getMoviesByGenre(id: number): Observable<Movie[]> {
      this.movieObservable = this.http.get(this.baseUrl + 'genre/' + id + '/movies')
        .map((response, err) => {
          console.log(response);
          this.movieObservable = null;

          if (response.status === 400) {
            return err;
          } else if (response.status === 200) {
            console.log(response.json());
            return response.json();
        }
      })
      .share();
      return this.movieObservable;
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

  movieSearchPage(query: string): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'movies/search?query=' + query)
      .toPromise()
      .then(function (res) {
        return res.json();
      }, function (err) {
        return err;
      });
  }
}
