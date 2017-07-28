import { Component, ElementRef, Input, ViewChild, Renderer2, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'slider',
	templateUrl: 'slider.component.html',
	styleUrls: ['slider.component.less'],
})

export class SliderComponent implements OnInit {
	@Input() max: number;
	@Input() min: number;
	@Input() round: boolean;
	@Input() isPercentage: boolean;
	@Output() onChange: EventEmitter<any> = new EventEmitter();
	@ViewChild('start') start: ElementRef;
	@ViewChild('end') end: ElementRef;

	public startValue: number = this.min;
	public startMax: number;
	public endValue: number = this.max;
	public endMin: number;
	public width: number = this.max;
	public originalStartOffset: number = this.max;
	public originalEndOffset: number = this.min;
	public endTooltip = false;
	public startTooltip = false;

	constructor(private el: ElementRef, private renderer: Renderer2) {
	}

	ngOnInit() {
		this.width = this.end.nativeElement.offsetParent.clientWidth - (this.end.nativeElement.offsetWidth / 2);

		this.originalStartOffset = this.start.nativeElement.clientLeft - this.start.nativeElement.offsetWidth;
		this.originalEndOffset = this.end.nativeElement.clientLeft - this.end.nativeElement.offsetWidth;

		this.endMin = this.originalStartOffset;
		this.startMax = this.width;
		this.startValue = this.min;
		this.endValue = this.max;
	}

	getStartValue($event: any) {
		let offset = this.width / (this.max - this.min);
		if (this.round) {
			this.startValue = Math.floor(this.min + (($event - this.originalStartOffset) / offset));
		} else {
			this.startValue = this.min + (($event - this.originalStartOffset) / offset);
		}
		if (this.startValue > this.max) {
			this.startValue = this.max;
		}

		let range = {
			start: this.startValue,
			end: this.endValue
		}
		this.onChange.emit(range);
		this.endMin = $event;
	}

	getEndValue($event: any) {
		let offset = this.width / (this.max - this.min);

		this.endValue = this.min + (($event - this.originalStartOffset) / offset);

		if (this.round) {
			this.endValue = Math.floor(this.min + (($event - this.originalStartOffset) / offset));
		} else {
			this.endValue = this.min + (($event - this.originalStartOffset) / offset);

		}
		if (this.endValue > this.max) {
			this.endValue = this.max;
		}

		let range = {
			start: this.startValue,
			end: this.endValue
		}
		this.onChange.emit(range);
		this.startMax = $event;
	}
}

