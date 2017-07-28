import { TestBed, inject } from '@angular/core/testing';

import { SliderComponent } from './slider.component';

describe('a slider component', () => {
	let component: SliderComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SliderComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([SliderComponent], (SliderComponent) => {
		component = SliderComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});