import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Genres } from '../models/genre.model';
import { MovieList } from '../models/movie-list.model';
import { Movie } from '../models/movie.model'; 
 
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GenreService {
  private baseUrl = 'http://lexireicks.com/upick/api/genre';

  constructor(private http: Http) { };


  getGenres(): Promise<Genres[]> {
    return this.http.get(this.baseUrl)
      .toPromise()
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });
  }
}