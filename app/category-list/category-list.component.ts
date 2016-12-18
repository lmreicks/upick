import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories.service';
import { MovieService } from '../services/movie.service';

@Component({
  moduleId: module.id,
  selector: 'category-list',
  templateUrl: 'category-list.component.html',
  styleUrls: ['category-list.component.css']
})
export class CategoryListComponent implements OnInit { 
  name = 'UPick'; 
  constructor(private CatService: CategoryService,
  private MovService: MovieService) {

  }

  categories: any[];
  movie: any;

  ngOnInit() {
    this.CatService.getCategories().then(x => this.categories = x);
  }

  getRandomMovie(categoryId: number){
    this.MovService.getRandomMovie(categoryId).then(x => this.movie = x);
  }
}