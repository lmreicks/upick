import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Genre } from '../models/genre.model';
import { MovieService } from '../services/movie.service';
import { GenreService } from '../services/genre.service';
import { Movie } from '../models/movie.model';

import 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css'],
})

export class GenreDetailsComponent implements OnInit {
    movies: Movie[];
    genre: Genre = new Genre();
    page: number;

    constructor(
        private GenService: GenreService,
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
      this.route.params.subscribe(res => this.page = res['page'] !== undefined ? +res['page'] : 1);
      this.route.params.subscribe(res => this.genre.id = res['id']);
      this.route.params.subscribe(res => this.genre.name = res['genre']);
      this.MovService.getMoviesByGenre(this.genre.id, this.page).then(res => this.movies = res);
      // get all movies in clicked genre
    }

    nextPage() {
      window.scrollTo(0, 0);
      this.page++;
      this.MovService.getMoviesByGenre(this.genre.id, this.page).then(res => this.movies = res);
    }

    prevPage() {
      window.scrollTo(0, 0);
      this.page--;
      this.MovService.getMoviesByGenre(this.genre.id, this.page).then(res => this.movies = res);
    }

    getRandom() {
      this.MovService.getRandomMovieByGenre(this.genre.id).then(function(res) {
        this.router.navigate(['movie', res.id]);
      });
    }
    
    getMovieInfo(id:number) {
      this.MovService.getMoreInfo(id).then(function(res) {
        this.router.navigate(['movie', res]);
      });
    }
}
