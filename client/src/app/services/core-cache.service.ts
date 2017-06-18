import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// services
import { GenreService } from './genre.service';
import { MovieService } from './movie.service';

import { Genre } from '../models/genre.model';
import { genreLookup } from '../models/genrelookup.model';

import 'rxjs/add/operator/toPromise';
import { Movie } from '../models/movie.model';
import 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CoreCacheService {
    public genres: Genre[] = [];
    public movies: Movie[];
    private movieObservable: Observable<Movie[]>;
    private genreObservable: Observable<Genre[]>;

  constructor(private GenService: GenreService, private MovService: MovieService) {};

  getGenres(): Genre[]  {
    if (this.genres && this.genres.length > 0) {
        return this.genres;
    }
    genreLookup.forEach((value, key) => {
        let genre = new Genre();
        genre.id = key;
        genre.name = value;
        this.genres.push(genre);
    });
    return this.genres;
  }

  getMoviesByGenre(genreId: number, pageNumber: number): Observable<Movie[]> {
      if (!this.genres) {
          this.getGenres();
      }
      let index = this.genres.map(x => x.id).indexOf(genreId);
      let start = 20 * (pageNumber - 1);
      console.log(start);
      if (!this.genres[index].movies) {
          console.log(this.genres);
          this.MovService.getMoviesByGenre(genreId).subscribe(movies => {
              console.log(movies);
              this.genres[index].movies = movies;
              return Observable.of(this.genres[index].movies.slice(start, start + 20));
          });
      } else {
          console.log(this.genres[index]);
          return Observable.of(this.genres[index].movies.slice(start, start + 20));
      }
  }

  getGenreName(id: number): string {
    return genreLookup.get(id);
  }

  getGenreId(genre: string): number {
      console.log(genre);
      let genreNumber = 0;
    if (genre) {
        genre = genre.charAt(0).toUpperCase() + genre.slice(1);
        genreLookup.forEach((value: string, key: number) => {
            if (value === genre) {
            genreNumber = key;
            }
        });
        return genreNumber;
    }
    return genreNumber;
}
}
