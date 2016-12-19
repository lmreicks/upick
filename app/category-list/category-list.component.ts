import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/categories.service';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'category-list',
  templateUrl: './app/category-list/category-list.component.html',
  styleUrls: ['./app/category-list/category-list.component.css']
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
}