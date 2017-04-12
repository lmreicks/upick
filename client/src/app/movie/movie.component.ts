import { Component, ElementRef, Input, ViewChild, OnInit, AfterContentChecked, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import 'chart.js';

import { Movie } from '../models/movie.model';
import { GenreService } from '../services/genre.service';
import { MovieService } from '../services/movie.service';

import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery';
import 'slick-carousel';

@Component({
  moduleId: module.id,
  selector: 'movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit, AfterContentChecked {
  public data:any = [];
  public rottendata:any = [];
  public type:string = 'doughnut';
  public options:any = {
    responsive:true,
    legend:false,
    cutoutPercentage: 75,
    tooltips: {
      enabled:false,
    }
  };
  public rottenoptions:any = {
    responsive:true,
    legend:false,
    cutoutPercentage: 75,
    tooltips: {
      enabled:false,
    }
  };
  public colors:any[] = [{ 
    backgroundColor: ["#006494", "#44A1C2"],
    borderColor: ["#006494", "#44A1C2"]
   }];
  public rottencolors:any[] = [{ 
    backgroundColor: ["#006494", "#44A1C2"],
    borderColor: ["#006494", "#44A1C2"]
  }];
  movie: Movie = new Movie();
  movieId:number;
  baseUrl:string = 'https://www.youtube.com/embed/';
  url:SafeResourceUrl;
  trailer:boolean = false;
  startSrc:string = "about:blank";
  closeResult: string;
  chart:boolean = false;
  rottenchart:boolean = false;
  gomovies:any;
  urltitle:any;

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
      /*this.MovService.getTest(this.movieId).then(movie => {
        this.movie = movie;*/

      this.MovService.getMoreInfo(this.movieId).then(movie => {
        this.movie = movie;
        if(this.movie.trailer_url) {
          this.loadFrame(this.movie.trailer_url);
        }
        if(this.movie.imdb_rating) {
          this.loadImdb(this.movie.imdb_rating);
        }
        if(this.movie.rotten_tomatoes) {
          this.loadRotten(parseInt(this.movie.rotten_tomatoes));
        }
        if(this.movie.title && this.movie.gomovies_id) {
          this.urltitle = this.movie.title;
          this.gomovies = "https://gomovies.to/film/" + this.urltitle.toLowerCase().replace(/ /g, "\-") + "-" + this.movie.gomovies_id;
          console.log(this.gomovies);
        }
      })
    });
  }

  ngAfterContentChecked() {
    $('.rec-slider').not('.slick-initialized').slick({
          slidesToShow: 4,
          arrows:true,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000
        });
  }

  loadFrame(id:String) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + id);
  }

  loadImdb(rating:number) {
    this.data = [10 - rating, rating];
      this.chart = !this.chart;
  }

  loadRotten(rating:number) {
    this.rottendata = [100 - rating, rating];
      this.rottenchart = !this.rottenchart;
  }

  showTrailer() {
    this.trailer = !this.trailer;
  }
  
  setSlides(event:any) {

  }

}