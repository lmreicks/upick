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
  isOpen: Boolean = false;
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

  out(event:any) {
    if (this.isOpen && event.type == 'focusout') {
      console.log(event);
    }
  }

  redirect(movie:any) {
    this.term.reset();
        this.router.navigate(['movie', movie.id]);
        this.isOpen = false;
  }

  handleKeyPress(event: any) {
    // handle up
    if (this.searchItems && this.isOpen) {
      if (event.key == 'ArrowUp' && this.selectedIndex > 0) {
          this.selectedIndex--;
      }
      // handle down
      if (event.key == 'ArrowDown' && this.selectedIndex < this.searchItems.length - 1) {
        this.selectedIndex++;
      }
      // handle enter
      if (event.key == 'Enter') {
        this.redirect(this.searchItems[this.selectedIndex]);
      }
    }
  }

}
