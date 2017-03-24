import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';

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
  movie: any;

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(){
    this.MovService.getRandom().then(res => this.movie = res);
  }
}
