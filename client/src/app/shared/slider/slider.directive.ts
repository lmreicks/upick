import { Directive, OnInit, Renderer, EventEmitter, ElementRef, Input, Output, HostListener } from '@angular/core';

@Directive({
	selector: '[draggable]',
})

export class DragDirective implements OnInit {
    private allowDrag = true;
	private moving = false;
	private original: Position = null;
	private oldPosition: any = '';
	private containerWidth: number;
	private originalOffset: number;

	ngDraggable: any;

	@Output() onMove: EventEmitter<any> = new EventEmitter();

	@Input() handle: any;
    @Input() draggable: any;
	@Input() max: number;
	@Input() min: number;

    @HostListener('mousedown', ['$event']) mouseDown(event: MouseEvent) { this.onMouseDown(event) }
    @HostListener('document:mouseup') mouseUp() { this.onMouseUp() }
    @HostListener('document:mouseleave') mouseLeave() { this.onMouseLeave() }
    @HostListener('document:mousemove', ['$event']) mouseMove($event: MouseEvent) { this.onMouseMove($event) }
    @HostListener('document:touchend') touchEnd() { this.onTouchEnd() }
    @HostListener('touchstart', ['$event']) touchStart($event: TouchEvent) { this.onTouchStart($event) }
    @HostListener('document:touchmove', ['$event']) touchMove($event: TouchEvent) { this.onTouchMove($event); }
	@HostListener('window:resize') resize() { this.windowResize(); }

	constructor(private el: ElementRef, private renderer: Renderer) {}

	ngOnInit() {
		if (this.allowDrag) {
            let element = this.handle ? this.handle : this.el.nativeElement;
            this.renderer.setElementClass(element, 'ng-draggable', true);
        }

		this.originalOffset = this.el.nativeElement.clientLeft - this.el.nativeElement.offsetWidth;
		this.containerWidth = this.el.nativeElement.parentElement.clientWidth - (this.el.nativeElement.offsetWidth / 2);
	}

	getPosition(x: number, y: number): Position {
		let left = parseInt(this.el.nativeElement.style.left.replace('px', ''));
		if (window) {
			left = parseInt(window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('left'));
		}

		return new Position(x - left, y);
	}

	moveTo(x: number, y: number) {
		this.onMove.emit(parseInt(this.el.nativeElement.style.left));
		if (this.original) {
			let nextPos = x - this.original.x;
			if (nextPos < this.max && nextPos > this.min) {
				this.renderer.setElementStyle(this.el.nativeElement, 'left', nextPos + 'px');
			}
        }
	}

	pickUp() {
		this.renderer.setElementClass(this.el.nativeElement, 'grabbed', true);
        this.oldPosition = this.el.nativeElement.style.position ? this.el.nativeElement.style.position : '';
        if (window) {
            this.oldPosition = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('position');
        }
        let position = 'relative';
        if (this.oldPosition && (this.oldPosition === 'absolute' ||
            this.oldPosition === 'fixed' ||
            this.oldPosition === 'relative')) {
            position = this.oldPosition;
        }
        this.renderer.setElementStyle(this.el.nativeElement, 'position', position);
        this.renderer.setElementStyle(this.el.nativeElement, 'z-index', '99999');
        if (!this.moving) {
            this.moving = true;
        }
	}

	putBack() {
		this.renderer.setElementClass(this.el.nativeElement, 'grabbed', false);
        if (this.moving) {
            this.moving = false;
        }
	}

	onMouseDown(event: MouseEvent) {
        if (event.button === 2 || (this.handle !== undefined && event.target !== this.handle)) {
            return;
        }
        this.original = this.getPosition(event.clientX, event.clientY);
        this.pickUp();
	}

	onMouseUp(): void {
		this.putBack();
	}

	onMouseLeave() {
		this.putBack();
	}

	onMouseMove(event: MouseEvent) {
		if (this.moving && this.allowDrag) {
            this.moveTo(event.clientX, event.clientY);
        }
	}

	onTouchEnd() {
		this.putBack();
	}

	onTouchStart(event: TouchEvent) {
		this.pickUp();
	}

	onTouchMove(event: TouchEvent) {
        event.stopPropagation();
        if (this.moving && this.allowDrag) {
            this.moveTo(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        }
	}

	windowResize() {
		this.originalOffset = this.el.nativeElement.clientLeft - this.el.nativeElement.offsetWidth;
		this.containerWidth = this.el.nativeElement.parentElement.clientWidth - (this.el.nativeElement.offsetWidth / 2);
	}
}

class Position {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
