import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';

import { Movie } from '../models/movie.model';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'movie',
  templateUrl: './app/movie/movie.component.html',
  styleUrls: ['./app/movie/movie.component.css']
})
export class MovieComponent implements OnInit{ 
  movie: Movie;
  
  constructor(
    private MovService: MovieService,
    private route: ActivatedRoute
  ) {}              

  ngOnInit(){
    this.route.params
    .switchMap((params: Params) => this.MovService.getRandomMovie(+params['id']))
    .subscribe(x => this.movie = x);
  }
}