import { Component } from '@angular/core';
import { FormControl } from '@angular/forms/';

import { MovieService } from './../services/movie.service';
import { Router } from '@angular/router';
import { Movie } from '../models/movie.model';

@Component({
	selector: 'pick-three',
	templateUrl: 'pick-three.component.html',
	styleUrls: ['./pick-three.component.less']
})

export class PickThreeComponent {
	searchItems: any;
  	term = new FormControl();
  	selectedIndex: number;
	movies: Movie[] = [];
	recommendations: Movie[] = [];

	constructor(private router: Router, private MovService: MovieService) {
		this.term.valueChanges.debounceTime(400)
			.distinctUntilChanged()
			.flatMap(term => this.MovService.movieSearch(term))
			.subscribe(res => {
			if (res != null && res.length >= 5) {
				this.searchItems = res.slice(0, 5);
			} else {
				this.searchItems = res;
			}
			this.selectedIndex = -1;
			});
	}

	close() {
		this.searchItems = '';
  	}

  	selectMovie(movie: Movie) {
    	this.term.reset();
		this.term.setValue('');
		this.searchItems = '';
    	this.movies.push(movie);
  	}

	delete(movie: Movie) {
		this.movies.splice(this.movies.indexOf(movie), 1);
	}

	findMovies() {
		this.MovService.pickThree(this.movies).then(res => {
			this.recommendations = res;
		})
	}

	goToMovie(movie: Movie) {
    	this.term.reset();
        this.router.navigate(['movie', movie.id]);
  	}

  	handleKeyPress(event: any) {
    // handle up
	if (this.searchItems) {
		if (event.key === 'ArrowUp' && this.selectedIndex > 0) {
			this.selectedIndex--;
		}
		// handle down
		if (event.key === 'ArrowDown' && this.selectedIndex < 			this.searchItems.length - 1) {
			this.selectedIndex++;
		}
		// handle enter
		if (event.key === 'Enter') {
			if (this.selectedIndex === -1) {
		// this.searchPageRedirect();
			} else {
				this.selectMovie(this.searchItems[this.selectedIndex]);
			}
		}
	}
  }
}
