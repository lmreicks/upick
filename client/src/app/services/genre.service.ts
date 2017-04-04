import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Genre } from '../models/genre.model';
 
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenreService {
  private baseUrl = 'http://lexireicks.com/upick/api/genre';

  constructor(private http: Http) { };


  getGenres(): Promise<Genre[]> {
    return this.http.get(this.baseUrl)
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  };
}