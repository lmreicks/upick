import { Component, OnInit, AfterContentChecked, TemplateRef } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
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
  movie: Movie = new Movie();
  movieId:number;
  baseUrl:string = 'https://www.youtube.com/embed/';
  url:SafeResourceUrl;
  trailer:boolean = false;
  startSrc:string = "about:blank";
  closeResult: string;

  constructor(
    private MovService: MovieService,
    private GenService: GenreService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
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

  ngAfterContentChecked() {
    $('.rec-slider').not('.slick-initialized').slick({
          centerMode:true,
          slidesToShow: 3,
          arrows:true,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
        });
  }

  loadFrame(id:String) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + id);
  }

  showTrailer() {
    this.trailer = !this.trailer;
  }

}