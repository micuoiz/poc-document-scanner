import { Injectable } from "@angular/core";

declare var jscanify: any;
declare var cv: any;

@Injectable({
  providedIn: "root"
})
export class JscanifyService {
  constructor() {}

  scanner: any = new jscanify();

  defaultResultWidth: number = 1240;
  defaultResultHeight: number = 1754;

  readImage(imageToRead: any) {
    return cv.imread(imageToRead);
  }

  getPaperContour(image: any) {
    return this.scanner.findPaperContour(this.readImage(image))
  }

  getCornerPoints(contour: any) {
    return this.scanner.getCornerPoints(contour)
  }

  extractPaper(image: any, cornerPoints: any) {
    return this.scanner.extractPaper(image, this.defaultResultWidth, this.defaultResultHeight, cornerPoints);
  }

  highlightPaper(image: any, options?: any) {
    return this.scanner.highlightPaper(image, options);
  }
}
