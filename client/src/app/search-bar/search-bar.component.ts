import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MovieService } from './../services/movie.service';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.less']
})
export class SearchBarComponent {
  searchItems: any;
  term = new FormControl();
  selectedIndex: number;

  constructor(public MovService: MovieService, public router: Router) {
    this.term.valueChanges.debounceTime(400)
                          .distinctUntilChanged()
                          .flatMap(term => this.MovService.movieSearch(term))
                          .subscribe(res => {
                            this.searchItems = res.slice(0, 5);
                            this.selectedIndex = -1;
                          });
  }

  close() {
    this.searchItems = null;
  }

  movieRedirect(movie:any) {
    this.term.reset();
        this.router.navigate(['movie', movie.id]);
  }

  searchPageRedirect() {
    this.router.navigate(['search'], {
      queryParams: {
        query: this.term.value
      }
    })
    this.term.reset();
  }

  handleKeyPress(event: any) {
    // handle up
    if (this.searchItems) {
      if (event.key == 'ArrowUp' && this.selectedIndex > 0) {
          this.selectedIndex--;
      }
      // handle down
      if (event.key == 'ArrowDown' && this.selectedIndex < this.searchItems.length - 1) {
        this.selectedIndex++;
      }
      // handle enter
      if (event.key == 'Enter') {
        if (this.selectedIndex == -1) {
          this.searchPageRedirect();
        }
        else {
          this.movieRedirect(this.searchItems[this.selectedIndex]);
        }
      }
    }
  }

}
