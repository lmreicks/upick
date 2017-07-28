import { Component, ViewChild, HostListener, OnInit, Output, Input, ElementRef, EventEmitter } from '@angular/core';

@Component({
    templateUrl: 'slider2.component.html',
    selector: 'slider-2',
    styleUrls: ['slider2.less']
})

export class Slider2Component implements OnInit {
    @Input() steps: any[];
    @Input() showTicks: boolean;
    @Input() step: number;
    @Input() range: boolean = false;
    @Input() disabled: boolean;
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('left') leftHandle: ElementRef;
    @ViewChild('right') rightHandle: ElementRef;
    @ViewChild('bar') bar: ElementRef;

    selected: any;
    moving: boolean;
    originalLeft: Position = new Position(0, 0);
    windowHeight: number = window.innerHeight;
    windowWidth: number = window.innerWidth;
    wrapperWidth: number;
    min: number;
    max: number;
    ticks: Tick[];
    handleDiameter: number = 32;
    tickDiameter: number = 10;

    constructor(private el: ElementRef) {
    }


    ngOnInit() {
        this.wrapperWidth = this.bar.nativeElement.clientWidth;
        this.max = this.wrapperWidth - (this.handleDiameter / 2) + (this.tickDiameter / 2);
        this.min = 0 - (this.handleDiameter / 2) + (this.tickDiameter / 2);
        this.leftHandle.nativeElement.style.left = this.min + 'px';
        this.setTicks();
        this.showTicks = true;
    }

    setTicks() {
            this.ticks = [];
            for (let i = 0; i < this.steps.length; i++) {
                let tick: Tick = {
                    selected: false,
                    step: this.steps[i],
                    position: this.calculateTickPosition(i),
                }

                this.ticks.push(tick);
            }
            console.log(this.ticks);
    }

    calculateTickPosition(step: number): Position {
        let x = (this.max) / (this.steps.length - 1);
        let positionX = (x * step) - (this.handleDiameter / 2) + (this.tickDiameter / 2);
        return new Position(positionX, 0);
    }

    /**
     * @param {number} x -- clientX: from event click
     * @param {number} y -- clientY: from event click
     * @param {any} element -- element that is being clicked and dragged
     */
    moveTo(x: number, y: number, element: any) {
        // original x and y are set when the mouse is clicked on a handle element
        // x and y given are the position the mouse is moving to, by taking the given position - the last position
        // we get a nice offset
        let xOffset = x - this.originalLeft.x;
        let yOffset = y - this.originalLeft.y;

        // if this offset is greater then the max (the mouse is outside the slider)
        // of the offset is less then the min, we don't want to update the position of the handle element
        if (xOffset <= this.max && xOffset >= this.min) {
            // we can either just move the handle freely or by steps
            if (this.showTicks) {
                // if we are moving by steps ...
                this.moveStep(xOffset, yOffset, element);
            } else {
                // else just set the left position
                // TODO: add y offsets, add vertical slider functionality
                element.style.left = xOffset + 'px';
            }
        }
    }

    /**
     * Moves selected element to step nearest to the mouse
     * @param {number} xOffset -- see moveTo function for x and y offsets
     * @param {number} yOffset -- see moveTo function for x and y offsets
     * @param {any} element -- element to move to the next step
     */
    moveStep(xOffset: number, yOffset: number, element: any) {
        let step = this.max / (this.steps.length - 1);
        let index = Math.round(xOffset / step);
        element.style.left = this.ticks[index].position.x + 'px';
    }

    /**
     * takes the client position and subtracts the current position
     * this is used for tracking the last position that the element was moved to
     * @param {number} x -- clientX from event
     * @param {number} y -- clientY from event
     */
    getOriginal(x: number, y: number): Position {
        // TODO: add right handle functionality
        let offset = parseInt(this.leftHandle.nativeElement.style.left.replace('px', ''));
        let yOffset = parseInt(this.leftHandle.nativeElement.style.bottom.replace('px', ''));
        if (!offset) {
            offset = 0;
        }

        if (!yOffset) {
            yOffset = 0;
        }

        return new Position(x - offset, y - yOffset);
    }

    pickUp(x: number, y: number, element: any) {
        this.selected = element;
        this.moving = true;
    }

    putDown() {
        this.selected = null;
        this.moving = false;
    }

    getElementClosestTo(element: any) {
        // todo
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: any) {
        console.log(event);
        // if the user clicks on a tick or the bar, we want to move the slider to the closest tick without clicking and dragging
        if (event.target.classList.contains('rz-tick') ||
            event.target.classList.contains('rz-bar') ||
            event.target.classList.contains('rz-bar-wrapper')) {
            this.moveTo(event.clientX, event.clientY, this.leftHandle.nativeElement);
        }
        // if left handle is clicked, set original, and pick it up
        if (event.target === this.leftHandle.nativeElement) {
            this.originalLeft = this.getOriginal(event.clientX, event.clientY);
            this.pickUp(event.clientX, event.clientY, event.target);
        }
        // if right handle is clicked, set original, and pick it up
        if (this.range && event.target === this.rightHandle.nativeElement) {
            // TODO: set original
            this.pickUp(event.clientX, event.clientY, event.target);
        }
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.putDown();
    }

    @HostListener('document:mouseleave')
    onMouseLeave() {
        this.putDown();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: any) {
        if (this.moving) {
            // move the selected element to the proper position using the clientX and Y
            if (this.selected === this.leftHandle.nativeElement) {
                this.moveTo(event.clientX, event.clientY, this.leftHandle.nativeElement);
            }
            if (this.range && this.selected === this.rightHandle.nativeElement) {
                this.moveTo(event.clientX, event.clientY, event.target);
            }
        }
    }

    // Support Touch Events:
    @HostListener('document:touchend')
    onTouchEnd() {
        this.putDown();
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: any) {
        // pick up
    }

    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: any) {
        // move
    }
}

export class Position {
    constructor(public x: number, public y: number) { }
}

export interface Tick {
    selected: boolean;
    step: any;
    position: Position;
}
