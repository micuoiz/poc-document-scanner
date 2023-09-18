import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JscanifyService } from "../../common/jscanify.service";
import {Dimensions, ImageCroppedEvent} from "ngx-image-cropper";

@Component({
  selector: 'app-frame-adjust',
  templateUrl: './frame-adjust.component.html',
  styleUrls: ['./frame-adjust.component.css']
})
export class FrameAdjustComponent implements OnInit {
  @ViewChild('cameraVideo')
  private cameraVideo: ElementRef = {} as ElementRef;
  @ViewChild('tempCanvas')
  private tempCanvas: ElementRef = {} as ElementRef;
  @ViewChild('screenshotCanvas')
  private screenshotCanvas: ElementRef = {} as ElementRef;
  @ViewChild('alignmentFrame')
  private alignmentFrame: ElementRef = {} as ElementRef;

  videoWidth: number = 0;
  videoHeight: number = 0;

  allDevices: MediaDeviceInfo[] = [];

  tempData: string | undefined = '';
  screenshotData: string | undefined = '';
  screenshotTaken: boolean = false;

  constructor(
    private jscanifyService: JscanifyService
  ) {}

  ngOnInit(): void {}

  imageLoaded() {
    this.screenshotTaken = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }


  async openCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    navigator.mediaDevices.getUserMedia(this.getConstraints(devices)).then((stream) => {
      const videoElement = this.cameraVideo.nativeElement;
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        this.videoWidth = videoElement.videoWidth;
        this.videoHeight = videoElement.videoHeight;

        const takeScreenshotButton = document.getElementById('screenshot-button');
        // @ts-ignore
        takeScreenshotButton.style.display = 'block';

        this.setAlignmentFrameDimensions(videoElement);
      };
    }).catch((error) => {
      console.error('Error accessing camera:', error);
    });
  }

  setAlignmentFrameDimensions(videoElement: any) {
    if (this.videoWidth !== null && this.videoHeight !== null) {
      const alignmentFrame = this.alignmentFrame.nativeElement;
      const frameWidth = videoElement.clientWidth * 0.6;
      const frameHeight = videoElement.clientHeight * 0.9;

      alignmentFrame.style.setProperty('--frame-width', frameWidth + 'px');
      alignmentFrame.style.setProperty('--frame-height', frameHeight + 'px');
    }
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

  initCropper(): void {
    this.screenshotData = this.extractFrame().toDataURL();
    this.screenshotTaken = true;
  }

  extractFrame() {
    // Capture a screenshot within the alignment frame
    const videoElement = this.cameraVideo.nativeElement;
    const canvas = this.screenshotCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;

    // Draw the video frame onto the canvas
    ctx.drawImage(videoElement, 0, 0, this.videoWidth, this.videoHeight);

    // Define the region to capture within the alignment frame
    const alignmentFrame = document.querySelector('.alignment-frame');
    // @ts-ignore
    const alignmentFrameRect = alignmentFrame.getBoundingClientRect();

    // Calculate the region to capture within the alignment frame
    const x = (alignmentFrameRect.left - videoElement.getBoundingClientRect().left) / videoElement.offsetWidth * this.videoWidth;
    const y = (alignmentFrameRect.top - videoElement.getBoundingClientRect().top) / videoElement.offsetHeight * this.videoHeight;
    const width = (alignmentFrameRect.width / videoElement.offsetWidth) * this.videoWidth;
    const height = (alignmentFrameRect.height / videoElement.offsetHeight) * this.videoHeight;

    // Capture the screenshot within the alignment frame
    const screenshot = ctx.getImageData(x, y, width, height);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Resize the canvas to match the frame's dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw the captured region onto the canvas
    ctx.putImageData(screenshot, 0, 0);
    return canvas;
  }

  processImage(canvas: any) {
    const paperContour = this.jscanifyService.getPaperContour(canvas);
    const resultCanvas = this.jscanifyService.extractPaper(canvas, this.jscanifyService.getCornerPoints(paperContour));
    const extractedCtx = this.screenshotCanvas.nativeElement.getContext("2d");
    this.screenshotCanvas.nativeElement.width = resultCanvas.width;
    this.screenshotCanvas.nativeElement.height = resultCanvas.height;
    extractedCtx.drawImage(resultCanvas, 0, 0);
    this.screenshotCanvas.nativeElement.style.removeProperty('display');
  }

  imageCropped(event: ImageCroppedEvent): void {
    // @ts-ignore
    this.tempData = event.base64;
  }

  confirmCrop(): void {
    const canvas = this.tempCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    // @ts-ignore
    image.src = this.tempData;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      this.processImage(canvas);
    };
  }
}
