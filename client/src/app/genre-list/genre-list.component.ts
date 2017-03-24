import { Component, OnInit } from '@angular/core';
import { Genre } from '../models/genre.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GenreService } from '../services/genre.service';
import { Movie } from '../models/movie.model';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'genre',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.css'],
})

export class GenreComponent implements OnInit {
    genres: Genre[];
    movie: any;
    movies: Movie[];

    constructor(private GenService: GenreService,
                private router: Router,
                private route: ActivatedRoute) { }

  ngOnInit() {
    this.GenService.getGenres().then(x => this.genres = x);
  }
}