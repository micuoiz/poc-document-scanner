import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JscanifyService } from "../../common/jscanify.service";
import { Dimensions, ImageCroppedEvent, LoadedImage } from "ngx-image-cropper";

@Component({
  selector: 'app-native',
  templateUrl: './native.component.html',
  styleUrls: ['./native.component.css']
})
export class NativeComponent implements OnInit {

  @ViewChild('extracted')
  private extracted: ElementRef = {} as ElementRef
  @ViewChild('tempCanvas')
  private tempCanvas: ElementRef = {} as ElementRef;

  tempData: Blob | undefined;
  screenshotTaken: boolean = false;
  imageChangedEvent: any = '';

  constructor(private jscanifyService: JscanifyService) {}

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    // @ts-ignore
    this.tempData = event.blob;
  }

  confirmCrop(): void {
    const canvas = this.tempCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    // @ts-ignore
    const blobUrl = URL.createObjectURL(this.tempData);

    const image = new Image();
    image.src = blobUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      this.processImage(canvas);
    };
  }

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

  processImage(canvas: any) {
    const paperContour = this.jscanifyService.getPaperContour(canvas);
    const resultCanvas = this.jscanifyService.extractPaper(canvas, this.jscanifyService.getCornerPoints(paperContour));
    const extractedCtx = this.extracted.nativeElement.getContext("2d");
    this.extracted.nativeElement.width = resultCanvas.width;
    this.extracted.nativeElement.height = resultCanvas.height;
    extractedCtx.drawImage(resultCanvas, 0, 0);
    this.extracted.nativeElement.style.removeProperty('display');
  }
}
