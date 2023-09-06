import { Component, ElementRef, ViewChild } from '@angular/core';
import { applyPolyfills, defineCustomElements } from "@oiz/stzh-components/loader";

// load the polyfills if you need to support older browsers
applyPolyfills().then(() => {
  defineCustomElements();
});

declare var jscanify: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'poc-document-scanner';
  files: File[] = [];

  @ViewChild('canvas')
  private canvas: ElementRef = {} as ElementRef;

  @ViewChild('result')
  private result: ElementRef = {} as ElementRef;

  @ViewChild('video')
  private video: ElementRef = {} as ElementRef;

  importFile(event: any) {
    if (event.target.files.length === 0) {
      console.log('No file selected!');
      return;
    }
    let file: File = event.target.files[0];
    this.files.push(file);
  }

  downloadFile(file: File) {
    const blob = new Blob([file], { type: file.type });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  openCamera(): void {
    const scanner = new jscanify();
    const canvasCtx = this.canvas.nativeElement.getContext('2d');
    const resultCtx = this.result.nativeElement.getContext("2d");
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.onloadedmetadata = () => {
        this.video.nativeElement.play();
        setInterval(() => {
          this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
          this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
          canvasCtx.drawImage(this.video.nativeElement, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
          const resultCanvas = scanner.highlightPaper(this.canvas.nativeElement);
          this.result.nativeElement.width = this.canvas.nativeElement.width;
          this.result.nativeElement.height = this.canvas.nativeElement.height;
          resultCtx.drawImage(resultCanvas, 0, 0, resultCanvas.width, resultCanvas.height);
        }, 10);
      };
    });
  }
}
