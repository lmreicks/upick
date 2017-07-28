import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output()
  public clickOutside = new EventEmitter();

  constructor(private _elemRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onclick(targetElement: any) {
    const clickedInside = this._elemRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(null);
    }
  }
}
