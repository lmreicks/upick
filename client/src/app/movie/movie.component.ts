import { Component, OnInit, AfterContentChecked, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser"; 

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
    tooltips: {
      enabled:false,
    }
  };
  public rottenoptions:any = {
    responsive:true,
    legend:false,
    tooltips: {
      enabled:false,
    }
  };
  public colors:any[] = [{ 
    backgroundColor: ["#2ADF2A", "#DF2A2A"],
    borderColor: ["#2ADF2A", "#DF2A2A"]
   }];
  public rottencolors:any[] = [{ 
    backgroundColor: ["#2ADF2A", "#DF2A2A"],
    borderColor: ["#2ADF2A", "#DF2A2A"]
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
  slides:number = 4;

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
        if(this.movie.imdb_rating) {
          this.loadImdb(this.movie.imdb_rating);
        }
        if(this.movie.rotten_tomatoes) {
          this.loadRotten(parseInt(this.movie.rotten_tomatoes));
        }
      })
    });
  }

  ngAfterContentChecked() {

    $('.rec-slider').not('.slick-initialized').slick({
          slidesToShow: this.slides,
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
    this.data = [rating, 10 - rating];
      this.chart = !this.chart;
  }

  loadRotten(rating:number) {
    this.rottendata = [rating, 100 - rating];
      this.rottenchart = !this.rottenchart;
  }

  showTrailer() {
    this.trailer = !this.trailer;
  }
  
  setSlides(event:any) {

  }

}