import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  constructor(private _elemRef: ElementRef) { }

  @Output()
  public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onclick(targetElement: any) {
    const clickedInside = this._elemRef.nativeElement.contains(targetElement);
    if(!clickedInside) {
      this.clickOutside.emit(null);
    }
  }
}
