import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { applyPolyfills, defineCustomElements } from "@oiz/stzh-components/loader";

// load the polyfills if you need to support older browsers
applyPolyfills().then(() => {
  defineCustomElements();
});

declare var jscanify: any;
declare var cv: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'poc-document-scanner';
  files: File[] = [];
  scanner: any = new jscanify();

  @ViewChild('canvas')
  private canvas: ElementRef = {} as ElementRef;

  @ViewChild('result')
  private result: ElementRef = {} as ElementRef;

  @ViewChild('extracted')
  private extracted: ElementRef = {} as ElementRef;

  @ViewChild('video')
  private video: ElementRef = {} as ElementRef;

  isCameraOpened: boolean = false;

  ngAfterViewInit() {
  }

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

  extract(): void {
    const image = cv.imread(this.result.nativeElement);
    const paperContour = this.scanner.findPaperContour(image);
    const resultCanvas = this.scanner.extractPaper(this.canvas.nativeElement, 1240, 1754, this.scanner.getCornerPoints(paperContour));
    const extractedCtx = this.extracted.nativeElement.getContext("2d");
    this.extracted.nativeElement.width = resultCanvas.width;
    this.extracted.nativeElement.height = resultCanvas.height;
    extractedCtx.drawImage(resultCanvas, 0, 0);
  }

  async openCamera() {
    this.isCameraOpened = true;
    const canvasCtx = this.canvas.nativeElement.getContext('2d');
    const resultCtx = this.result.nativeElement.getContext("2d");
    let userMedia = await navigator.mediaDevices.enumerateDevices();
    userMedia.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        console.log(mediaDevice);
      }
    });

    console.log(userMedia);
  }
}
