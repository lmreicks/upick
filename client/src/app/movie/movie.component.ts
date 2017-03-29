import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

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
  startSrc:string = "about:blank";

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params
    .subscribe(res => this.movieId = +res['id']);
    // until we get api set up correctly, this will just get a random movie
    this.MovService.getMoreInfo(this.movieId).then(res => this.movie = res);
  }

  loadFrame(id:String) {
    var iframe = document.getElementById('iframe');
    var iWindow = (<HTMLIFrameElement>iframe).contentWindow;
    var doc = (<HTMLIFrameElement>iframe).contentWindow.document;
    doc.write("<h1>CLICK ME BITCH</h1>");
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + id);
  }

}