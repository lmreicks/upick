import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MovieService } from './../services/movie.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent {
  searchItems: any;
  term = new FormControl();
  isOpen: Boolean;
  selectedIndex: number;

  constructor(public MovService: MovieService, public router: Router) {
    this.term.valueChanges.debounceTime(400)
                          .distinctUntilChanged()
                          .flatMap(term => this.MovService.movieSearch(term))
                          .subscribe(res => {
                            this.searchItems = res;
                            this.selectedIndex = -1;
                          });
  }

  close() {
    this.searchItems = null;
  }

  redirect(movie: any) {
    this.term.reset();
    this.router.navigate(['/movie', movie.id]);
  }

  handleKeyPress(event: any) {
    console.log(event.keyCode);
    // handle up
    if (event.key == 'ArrowUp' && this.searchItems && this.searchItems.length && this.selectedIndex > 0) {
        this.selectedIndex--;
    }
    // handle down
    if (event.key == 'ArrowDown' && this.searchItems && this.selectedIndex < this.searchItems.length - 1) {
      this.selectedIndex++;
    }
    // handle enter
    if (event.key == 'Enter' && this.searchItems && this.selectedIndex >= 0 && this.selectedIndex < this.searchItems.length) {
      this.redirect(this.searchItems[this.selectedIndex]);
    }
  }

}
