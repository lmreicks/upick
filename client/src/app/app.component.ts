import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from './models/movie.model';
import { FormControl } from '@angular/forms';

import { SearchBarComponent } from './search-bar/search-bar.component';
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
  navVisible = true;
  showSearch = true;
  dropVisible = true;
  searchItems: Array<any>;
  selectedIndex = 0;
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

  selectItem(event: any) {
    if (this.dropVisible && this.searchItems) {
      if (event.key === 'ArrowDown' && this.selectedIndex < this.searchItems.length - 1) {
        this.selectedIndex++;
      }
      if (event.key === 'ArrowUp' && this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      if (event.key === 'Enter') {
        this.router.navigate(['movie', this.searchItems[this.selectedIndex].id]);
        this.dropVisible = false;
      }
    }
  }
}

