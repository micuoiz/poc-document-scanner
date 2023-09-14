import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JscanifyService } from "../../common/jscanify.service";

@Component({
  selector: 'app-native',
  templateUrl: './native.component.html',
  styleUrls: ['./native.component.css']
})
export class NativeComponent implements OnInit {

  @ViewChild('extracted')
  private extracted: ElementRef = {} as ElementRef

  constructor(private jscanifyService: JscanifyService) {}

  ngOnInit(): void {
  }

  processImage(event: any) {
    let imgElement = document.getElementById('pictureTaken') as HTMLImageElement;
    imgElement.src = URL.createObjectURL(event.target.files[0]);
    imgElement.onload = () => {
      const paperContour = this.jscanifyService.getPaperContour(imgElement);
      const resultCanvas = this.jscanifyService.extractPaper(imgElement, this.jscanifyService.getCornerPoints(paperContour));
      const extractedCtx = this.extracted.nativeElement.getContext("2d");
      this.extracted.nativeElement.width = resultCanvas.width;
      this.extracted.nativeElement.height = resultCanvas.height;
      extractedCtx.drawImage(resultCanvas, 0, 0);
      imgElement.style.display = 'none';
    };
  }

}
