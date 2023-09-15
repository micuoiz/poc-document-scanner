import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var cv: any;

@Component({
  selector: 'app-opencv',
  templateUrl: './opencv.component.html',
  styleUrls: ['./opencv.component.css']
})
export class OpencvComponent implements OnInit {

  @ViewChild('extracted')
  private extracted: ElementRef = {} as ElementRef

  constructor() {}

  ngOnInit(): void {}

  processImage(event: any) {
    let imgElement = document.getElementById('pictureTaken') as HTMLImageElement;
    imgElement.src = URL.createObjectURL(event.target.files[0]);
    imgElement.onload = () => {

      // openCV
      const canvas = document.createElement("canvas");
      const image = cv.imread(imgElement);
      const kernel = cv.getStructuringElement(cv.MORPH_OPEN, new cv.Size(5,5));
      const result = new cv.Mat();
      const anchor = new cv.Point(-1, -1);

      cv.morphologyEx(image, result, cv.MORPH_CLOSE, kernel, anchor, 5);
      cv.imshow(canvas, result);

      this.drawResultCanvas(canvas, imgElement);
    };
  }

  private drawResultCanvas(canvas: HTMLCanvasElement, imgElement: HTMLImageElement) {
    const extractedCtx = this.extracted.nativeElement.getContext("2d");
    this.extracted.nativeElement.width = canvas.width;
    this.extracted.nativeElement.height = canvas.height;
    extractedCtx.drawImage(canvas, 0, 0);
    imgElement.style.display = 'none';
  }
}
