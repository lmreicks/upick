import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { MovieService } from './services/movie.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'UPick';
  @Input('query') query:string;
  navVisible:boolean = true;
  searchVisible:boolean = true;

  constructor(public MovService: MovieService, public router: Router) {}

  getRandom() {
    let vm = this;
    this.MovService.getRandom().then(function(res) {
      vm.router.navigate(['movie', res.id]);
    });
  }

  movieSearch() {
    let vm = this;
    console.log(this.query);
    this.MovService.movieSearch(this.query).then(function(res) {
      if (res == null) {
        vm.router.navigate(['PageNotFound']);
      }
      else {
        vm.router.navigate(['movie', res.id]);
      }
    });
  }

}

