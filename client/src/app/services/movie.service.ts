import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Movie } from '../models/movie.model';
import { MovieList } from '../models/movie-list.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MovieService {
  private baseUrl = 'http://lexireicks.com/upick/api/';

  constructor(private http: Http) { };

  getMoviesByGenre(id:number): Promise<Movie[]> {
    return this.http.get(this.baseUrl + "genres/" + id)
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }

  getRandom(): Promise<Movie> {
    return this.http.get(this.baseUrl + "movies")
    .toPromise()
    .then(function(res) {
      return res.json();
    }, function(err) {
      return err;
    });
  }

  getRandomMovieByGenre(id:number): Promise<Movie> {
    return this.http.get(this.baseUrl + "genres/" + id + "/random")
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }

  getTopMovies(): Promise<Movie[]> {
    return this.http.get(this.baseUrl + "top")
    .toPromise()
    .then(function(res) {
      console.log(res.json());
      return res.json();
    }, function(err) {
      return err;
    });
  }
}