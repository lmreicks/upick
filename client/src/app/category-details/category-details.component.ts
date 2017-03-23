import { Component, OnInit, Input,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MovieList } from '../models/movie-list.model';
import { Category } from '../models/category.model';
import { MovieService } from '../services/movie.service';
import { GenreService } from '../services/genre.service';
import { CategoryService} from '../services/categories.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
  animations: [
    trigger('focusPanel', [
      state('inactive', style({
        display: 'none'
      })),
      state('active',   style({
        display: 'unset'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})

export class CategoryDetailsComponent { 
    constructor(
        private CatService: CategoryService,
        private router: Router,
        private route: ActivatedRoute) {
    }

  categories: Category;
  movies: MovieList[];
  
  /*
  toggleMove(obj:any) {
   console.log(obj);
          obj.state = obj.state === 'active' ? 'inactive' : 'active'; 
  }*/

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
        this.categories = params['item'];
    }) 
    this.route.params
        .switchMap((params: Params) => this.CatService.getMoviesByCategory(params['item']))
        .subscribe(res => this.movies = res)
  }

}