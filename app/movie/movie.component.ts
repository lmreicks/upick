import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';

import { Movie } from '../models/movie.model';
import { GenreService } from '../services/genre.service';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'movie',
  templateUrl: './app/movie/movie.component.html',
  styleUrls: ['./app/movie/movie.component.css']
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

    this.route.params
      .subscribe((params: Params) => {
        let genreId = params['genreId']
        let categoryId = params['categoryId']
        if (genreId != null) {
            this.getMovie("genre")
        }
        else if (categoryId != null) {
            this.getMovie("category")
            
        }
        else {
          console.log(+params['genreId'])
          console.log(params)
          console.log('no category or genre id')
        }
      });
  }

getMovie(section:String) {
  if (section == "genre") {
    this.route.params
    .switchMap((params: Params) => this.MovService.getRandomMovieByGenre(+params['genreId']))
    .subscribe(res => this.movie = res)
  }
}

}
