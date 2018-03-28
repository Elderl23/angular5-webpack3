import { Component } from '@angular/core';
import { environment } from 'environments/environment';
// import { AppState } from './app.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html'
})
export class AppComponent {
  showDevModule: boolean = environment.showDevModule;
}
