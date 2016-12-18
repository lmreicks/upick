import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import {Movie} from '../models/movie.model';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MovieService {
  private baseUrl = 'http://upick/api/';

  constructor(private http: Http) { };

  getRandomMovie(categoryId:number): Promise<Movie> {
    return this.http.get(this.baseUrl + 'categories/' + categoryId + '/movies/random')
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  };

  getMoviesByCategory(categoryId:number): Promise<Movie[]> {
    return this.http.get(this.baseUrl + 'categories/' + categoryId + '/movies')
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }
}