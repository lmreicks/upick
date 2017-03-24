import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Movie } from '../models/movie.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MovieService {
  private baseUrl = 'http://lexireicks.com/upick/api/';

  constructor(private http: Http) { };

  getMoviesByGenre(id: number, pageNumber: number): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'genres/' + id + '/' + pageNumber)
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }

  getRandom(): Promise<Movie> {
    return this.http.get(this.baseUrl + 'movies')
    .toPromise()
    .then(function(res) {
      return res.json();
    }, function(err) {
      return err;
    });
  }

  getMoreInfo(id: number): Promise<Movie> {
    return this.http.get(this.baseUrl + 'movies/' + id + '/more')
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }

  getRandomMovieByGenre(id:number): Promise<Movie> {
    return this.http.get(this.baseUrl + 'genres/' + id + '/random')
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }

  getTopMovies(): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'top')
    .toPromise()
    .then(function(res) {
      return res.json();
    }, function(err) {
      return err;
    });
  }
}