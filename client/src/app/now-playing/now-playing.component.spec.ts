import { TestBed, inject } from '@angular/core/testing';

import { NowPlayingComponent } from './now-playing.component';

describe('a now-playing component', () => {
	let component: NowPlayingComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NowPlayingComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([NowPlayingComponent], (NowPlayingComponent) => {
		component = NowPlayingComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});