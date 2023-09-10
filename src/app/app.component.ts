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

  ngAfterViewInit() {
    this.openCamera();
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
    const resultCanvas = this.scanner.extractPaper(this.canvas.nativeElement, 500, 1000, this.scanner.getCornerPoints(paperContour));
    const extractedCtx = this.extracted.nativeElement.getContext("2d");
    this.extracted.nativeElement.width = resultCanvas.width;
    this.extracted.nativeElement.height = resultCanvas.height;
    extractedCtx.drawImage(resultCanvas, 0, 0);
  }

  openCamera(): void {
    const canvasCtx = this.canvas.nativeElement.getContext('2d');
    const resultCtx = this.result.nativeElement.getContext("2d");
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.onloadedmetadata = () => {
        this.video.nativeElement.play();
        setInterval(() => {
          this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
          this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
          canvasCtx.drawImage(this.video.nativeElement, 0, 0);
          const resultCanvas = this.scanner.highlightPaper(this.canvas.nativeElement);
          this.result.nativeElement.width = this.canvas.nativeElement.width;
          this.result.nativeElement.height = this.canvas.nativeElement.height;
          resultCtx.drawImage(resultCanvas, 0, 0, resultCanvas.width, resultCanvas.height);
        }, 10);
      };
    });
  }
}
