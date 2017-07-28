import { Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre.model';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { GenreService } from '../services/genre.service';
import { Movie } from '../models/movie.model';
import { CoreCacheService } from '../services/core-cache.service';

import { genreLookup } from '../models/genrelookup.model';

import 'rxjs/add/operator/switchMap';

export interface YearRange {
  start: number,
  end: number
}

export interface RatingRange {
  start: number,
  end: number
}

@Component({
  moduleId: module.id,
  selector: 'genre',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.less'],
})

export class GenreComponent implements OnInit {
  selectedGenre: number;
  yearRange: YearRange;
  ratingRange: RatingRange;
  genres: Genre[];
  genreId: number;
  movie: any;
  movies: Movie[];
  queryParams: string;

  constructor(private CoreCache: CoreCacheService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.genres = this.CoreCache.getGenres();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.route.params.subscribe(param => {
        this.selectedGenre = this.getGenreId(param['genre']);

        this.route.queryParamMap.subscribe(params => {
          this.yearRange = {
            start: parseInt(params.get('startYear')),
            end: parseInt(params.get('endYear'))
          }
          this.ratingRange = {
            start: parseInt(params.get('ratingStart')),
            end: parseInt(params.get('ratingEnd'))
          }
          console.log(params);

          if (params.keys.length > 0) {
            this.queryParams = '?' + params.keys[0] + '=' + params.get(params.keys[0]);
            for (let i = 1; i < params.keys.length; i++) {
              if (!!params.get(params.keys[i])) {
                this.queryParams = this.queryParams + '&' + params.keys[i] + '=' + params.get(params.keys[i]);
              }
            }
          }

          console.log(this.queryParams);
        });
      });
    });
  }

  yearChange($event) {
    this.yearRange = $event;
  }

  ratingChange($event) {
    this.ratingRange = $event;
  }

  setParams() {
    console.log(this.queryParams);
    this.route.queryParamMap.subscribe(params => {
      this.yearRange = {
        start: parseInt(params.get('startYear')),
        end: parseInt(params.get('endYear'))
      }
      if (!!this.yearRange.start && !!this.yearRange.end) {
        this.queryParams = '?startYear=' + this.yearRange.start + '&endYear=' + this.yearRange.end;
      } else if (!!this.yearRange.start) {
        this.queryParams = '?startYear=' + this.yearRange.start;
      } else if (!!this.yearRange.end) {
        this.queryParams = '?endYear=' + this.yearRange.end;
      } else { this.queryParams = '' }
    });
  }

  filter() {
    let params = {};

    if (this.yearRange.start) {
      params['startYear'] = this.yearRange.start;
    }

    if (this.yearRange.end) {
      params['endYear'] = this.yearRange.end;
    }

    if (this.ratingRange.start) {
      params['ratingStart'] = this.ratingRange.start;
    }

    if (this.ratingRange.end) {
      params['ratingEnd'] = this.ratingRange.end;
    }

    this.router.navigate([], {
      queryParams: params,
      relativeTo: this.route
    })

    this.setParams();
  }

  loadDetails(genre: Genre) {
    this.selectedGenre = genre.id;
    this.router.navigate(['genre', genre.name]);
  }

  getGenreId(genre: string): number {
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
