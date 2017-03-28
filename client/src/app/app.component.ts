import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MovieService } from './services/movie.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'UPick';

  constructor(public MovService: MovieService, public router: Router) {}

  getRandom() {
    let vm = this;
    this.MovService.getRandom().then(function(res) {
      vm.router.navigate(['movie', res.id]);
    });
  }
}

