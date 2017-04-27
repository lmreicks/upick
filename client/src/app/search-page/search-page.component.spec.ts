import { TestBed, inject } from '@angular/core/testing';

import { SearchPageComponent } from './search-page.component';

describe('a search-page component', () => {
	let component: SearchPageComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SearchPageComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([SearchPageComponent], (SearchPageComponent) => {
		component = SearchPageComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});