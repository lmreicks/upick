import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Movie } from '../models/movie.model';
import { MovieService } from './movie.service';

/*
    Gets the movie id from the url, gets more info, and then returns it as a movie.
    This allows you to load the data before you load the component, avoiding loading static elements before dynamic.
    If the movie isn't found, it will navigate to home.
*/

@Injectable()
export class MovieDetailResolver implements Resolve<Movie> {
  constructor(private movService: MovieService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Movie> {

    console.log(state);
    let id = route.params['id'];
    let genreid = route.params['genreId'];
    return this.movService.getMoreInfo(id).then(movie => {
      if (movie) {
          console.log(genreid);
        return movie;
      } else { // id not found
        this.router.navigate(['/top']);
        return null;
      }
    });
  }
}