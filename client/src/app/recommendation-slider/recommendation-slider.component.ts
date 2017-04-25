import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'recommendation-slider',
  templateUrl: './recommendation-slider.component.html',
  styleUrls: ['./recommendation-slider.component.less']
})
export class RecommendationSliderComponent implements OnInit {
  @Input() images: Array<Movie>;

  visible: Array<Movie>;
  constructor() {

   }

  ngOnInit() {
    this.visible = this.images.concat(this.images);
  }

}
