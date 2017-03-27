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
    this.MovService.getRandom().then(function(res) {
      this.router.navigate(['movie', res]);
    });
  }
}

