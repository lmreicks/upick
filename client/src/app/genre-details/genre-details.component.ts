import { Component, OnInit, Input,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieList } from '../models/movie-list.model';
import { Genres } from '../models/genre.model';
import { MovieService } from '../services/movie.service';
import { GenreService } from '../services/genre.service';
import { Movie } from '../models/movie.model';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.css'],
  animations: [
    trigger('focusPanel', [
      state('inactive', style({
        float:'right',
        display: 'none'
      })),
      state('active',   style({
        display: 'block'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})

export class GenreDetailsComponent { 
    constructor(
        private GenService: GenreService,
        private MovService: MovieService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  genres: Genres;
  movies: any;
  movie: Movie;
  
  toggleMove(obj:any) {
   console.log(obj);
          obj.state = obj.state === 'active' ? 'inactive' : 'active'; 
  }

  ngOnInit() {
    //get random movie from clicked genre
    if (this.route.root.outlet === '/genre/random') {
      console.log("random");
      this.route.params
      .switchMap((params: Params) => this.MovService.getRandomMovieByGenre(params['id']))
      .subscribe(res => this.movie = res)
    }
    else {
      //get all movies in clicked genre
    this.route.params
        .switchMap((params: Params) => this.MovService.getMoviesByGenre(params['id']))
        .subscribe(res => this.movies = res)
    }
  }

}
