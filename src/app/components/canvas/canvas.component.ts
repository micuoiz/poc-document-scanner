import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { JscanifyService } from "../../common/jscanify.service";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit {
  title = 'poc-document-scanner';
  files: File[] = [];

  @ViewChild('canvas')
  private canvas: ElementRef = {} as ElementRef;

  @ViewChild('result')
  private result: ElementRef = {} as ElementRef;

  @ViewChild('extracted')
  private extracted: ElementRef = {} as ElementRef;

  @ViewChild('video')
  private video: ElementRef = {} as ElementRef;

  isCameraOpened: boolean = false;

  allDevices: MediaDeviceInfo[] = [];

  constructor(private jscanifyService: JscanifyService) {}

  ngAfterViewInit() {
  }

  downloadFile(file: File) {
    const blob = new Blob([file], {type: file.type});
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
    const paperContour = this.jscanifyService.getPaperContour(this.result.nativeElement);
    const resultCanvas = this.jscanifyService.extractPaper(this.result.nativeElement, this.jscanifyService.getCornerPoints(paperContour));
    const extractedCtx = this.extracted.nativeElement.getContext("2d");
    this.extracted.nativeElement.width = resultCanvas.width;
    this.extracted.nativeElement.height = resultCanvas.height;
    extractedCtx.drawImage(resultCanvas, 0, 0);
  }

  async openCamera() {
    const canvasCtx = this.canvas.nativeElement.getContext('2d');
    const resultCtx = this.result.nativeElement.getContext("2d");
    const devices = await navigator.mediaDevices.enumerateDevices();
    const constraints = this.getConstraints(devices);

    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.onloadedmetadata = () => {
        this.video.nativeElement.play();
        setInterval(() => {
          this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
          this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
          canvasCtx.drawImage(this.video.nativeElement, 0, 0);
          const resultCanvas = this.jscanifyService.highlightPaper(this.canvas.nativeElement, {
            color: 'green',
            thickness: 4
          });
          this.result.nativeElement.width = this.canvas.nativeElement.width;
          this.result.nativeElement.height = this.canvas.nativeElement.height;
          resultCtx.drawImage(resultCanvas, 0, 0);
        }, 10);
      };
    });

    this.isCameraOpened = true;
  }

  getConstraints(userMedia: MediaDeviceInfo[]) {
    const videoDevices = userMedia.filter(mediaDevice => mediaDevice.kind === 'videoinput');
    this.allDevices = videoDevices;

    return {
      audio: false,
      video: {
        width: {ideal: 1920},
        height: {ideal: 1080},
        frameRate: {exact: 30},
        facingMode: 'environment'
      }
    };
  }
}
