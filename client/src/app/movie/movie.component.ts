import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { Movie } from '../models/movie.model';
import { GenreService } from '../services/genre.service';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit{
  movie: Movie;

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.MovService.getRandom().then(res => this.movie = res);
  }
}
