import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Genre } from '../models/genre.model';
import { genreLookup } from '../models/genrelookup.model';

//import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GenreService {
  private baseUrl = 'http://lexireicks.com/upick/api/genre';
  public observable: Observable<Genre[]>;

  constructor(private http: Http) {};

  getGenres(): Observable<Genre[]> {
    /*return this.http.get(this.baseUrl)
      .then(function(res) {
        return res.json();
      }, function(err) {
        return err;
      });*/
      this.observable = this.http.get(this.baseUrl)
        .map((response, err) => {
          console.log(response);
          this.observable = null;

          if (response.status === 400) {
            return err;
          } else if (response.status === 200) {
            return response.json();
        }
      })
      .share();
      return this.observable;
  };

  getGenre(id: number) {
    return genreLookup.get(id);
  }
}
