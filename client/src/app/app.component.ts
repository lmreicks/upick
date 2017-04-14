import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from './models/movie.model';
import { FormControl } from '@angular/forms';

import { MovieService } from './services/movie.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  name = 'UPick';
  @Input('query') query: string;
  navVisible: boolean = true;
  searchVisible: boolean = true;
  searchItems: any;
  term = new FormControl();

  constructor(public MovService: MovieService, public router: Router) {
    this.term.valueChanges.debounceTime(400)
                          .distinctUntilChanged()
                          .flatMap(term => this.MovService.movieSearch(term))
                          .subscribe(res => this.searchItems = res);
  }

  getRandom() {
    let vm = this;
    this.MovService.getRandom().then(function (res) {
      vm.router.navigate(['movie', res.id]);
    });
  }
}

