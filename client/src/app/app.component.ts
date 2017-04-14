import { Component, Input, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from './models/movie.model';
import { FormControl } from '@angular/forms';

import { MovieService } from './services/movie.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'UPick';
  @Input('query') query: string;
  lastScrollTop: number = 0;
  direction: string = "";
  headerVisible: boolean = true;
  dropVisible: boolean = false;
  navVisible: boolean = true;
  searchVisible: boolean = true;
  searchItems: Array<any>;
  selectedIndex:number = 0;
  term = new FormControl();


  constructor(public MovService: MovieService, public router: Router, private lc: NgZone) {
    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.MovService.movieSearch(term))
      .subscribe(res => {
        this.searchItems = res;
      });

  window.onscroll = () => {
        let st = window.pageYOffset;
        let dir = '';
        if (st > this.lastScrollTop) {
            dir = "down";
        } else {
            dir = "up";
        }
        this.lastScrollTop = st;
        lc.run(() => {
          this.direction = dir;
        });
      if (dir == "down") {
        //this.headerVisible = false;
      }
      else {
        //this.headerVisible = true;
        //top++;
      }
    };
  }
  getRandom() {
    let vm = this;
    this.MovService.getRandom().then(function (res) {
      vm.router.navigate(['movie', res.id]);
    });
  }

  selectItem(event:any) {
    if (this.dropVisible && this.searchItems) {
      if (event.key == "ArrowDown" && this.selectedIndex < this.searchItems.length - 1) {
        this.selectedIndex++;
      }
      if (event.key == "ArrowUp" && this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      if (event.key == "Enter") {
        this.router.navigate(['movie', this.searchItems[this.selectedIndex].id]);
        this.dropVisible = false;
      }
    }
  }
}

