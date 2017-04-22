import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recommendation-slider',
  templateUrl: './recommendation-slider.component.html',
  styleUrls: ['./recommendation-slider.component.less']
})
export class RecommendationSliderComponent implements OnInit {
  @Input() images:any;
  constructor() {
    
   }

  ngOnInit() {
    console.log(this.images);
  }

}
