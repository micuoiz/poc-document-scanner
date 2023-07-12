import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'poc-screenshot';

  importFile(event) {
    if (event.target.files.length === 0) {
      console.log('No file selected!');
      return;
    }
    let file: File = event.target.files[0];
    console.log(file);
    // after here 'file' can be accessed and used for further process
  }
}
