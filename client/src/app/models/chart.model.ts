export class Chart {
  	type = 'doughnut';
  	options: any = {
    	responsive: true,
    	legend: false,
    	cutoutPercentage: 75,
    	tooltips: {
      	enabled: false,
    	}
  	};
	colors: any[] = [{
		backgroundColor: ['#006494', '#44A1C2'],
		borderColor: ['#006494', '#44A1C2']
	}];
}
