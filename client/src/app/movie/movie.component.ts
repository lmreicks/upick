import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment, NavigationEnd } from '@angular/router';

import { Movie } from '../models/movie.model';
import { GenreService } from '../services/genre.service';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  moduleId: module.id,
  selector: 'movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit{
  movie: Movie = new Movie();
  movieId:number;
  baseUrl:string = 'https://www.youtube.com/embed/';
  url:SafeResourceUrl;
  trailer:boolean = false;
  startSrc:string = "about:blank";

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
    this.route.params.subscribe(param => {
      this.movieId = +param['id'];

      this.MovService.getMoreInfo(this.movieId).then(movie => {
        this.movie = movie;
        if(this.movie.trailer_url) {
          this.loadFrame(this.movie.trailer_url);
        }
      });
      
    }); 
  }

  loadFrame(id:String) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + id);
  }
  
  showTrailer() {
    this.trailer = !this.trailer;
  }

}