import { Component, Input} from '@angular/core';

/*const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
*/
@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent { 
  name = 'UPick'; 
}

