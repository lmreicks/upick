import { Component, OnInit } from '@angular/core';
import { Genres } from '../models/genre.model';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { MovieService } from '../services/movie.service';
import { GenreService } from '../services/genre.service';
import { MovieList } from '../models/movie-list.model'; 

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'genre',
  templateUrl: './app/genre-list/genre-list.component.html',
  styleUrls: ['./app/genre-list/genre-list.component.css'],
})

export class GenreComponent implements OnInit { 
    constructor(
    private GenService: GenreService,
    private router: Router,
    private route: ActivatedRoute) {

  }
  genres: any[];
  movie: any;
  movies: MovieList[];

  ngOnInit() {
    this.GenService.getGenres().then(x => this.genres = x);
  }
}