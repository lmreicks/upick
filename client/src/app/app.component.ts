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
  searchItems: any;
  term = new FormControl();

  constructor(public MovService: MovieService, public router: Router, private lc: NgZone) {
    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .flatMap(term => this.MovService.movieSearch(term))
      .subscribe(res => this.searchItems = res);
  

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
        this.headerVisible = false;
      }
      else {
        this.headerVisible = true;
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
    if (this.dropVisible) {
      if(event.key == "ArrowDown") {
        
      }
      if (event.key == "ArrowUp") {

      }
    }
  }
}

