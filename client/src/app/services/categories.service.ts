import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Category } from '../models/category.model';
import { MovieList } from '../models/movie-list.model'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoryService {
  private baseUrl = 'http://lexireicks.com/upick/api/categories';

  constructor(private http: Http) { };

  getCategories(): Promise<Category[]> {
    return this.http.get(this.baseUrl)
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }

  getMoviesByCategory(genre:String): Promise<MovieList[]> {
    return this.http.get(this.baseUrl + "/" + genre)
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }
}