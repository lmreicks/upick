import { Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GenreService } from '../services/genre.service';
import { Movie } from '../models/movie.model';
import { CoreCacheService } from '../services/core-cache.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'genre',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.less'],
})

export class GenreComponent implements OnInit {
    selectedGenre: number;
    genres: Genre[];
    genreId: number;
    genreName: string;
    movie: any;
    movies: Movie[];

    constructor(private CoreCache: CoreCacheService,
                private router: Router,
                private route: ActivatedRoute) { }

  ngOnInit() {
    this.genres = this.CoreCache.getGenres();
    this.route.params.subscribe(param => {
      this.selectedGenre = this.CoreCache.getGenreId(param['genre']);
    });
  }

  loadDetails(genreId: number) {
    this.route.params.subscribe(param => this.selectedGenre = this.CoreCache.getGenreId(param['genre']));
  }

}
