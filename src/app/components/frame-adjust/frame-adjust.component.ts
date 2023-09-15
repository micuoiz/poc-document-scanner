import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-frame-adjust',
  templateUrl: './frame-adjust.component.html',
  styleUrls: ['./frame-adjust.component.css']
})
export class FrameAdjustComponent implements OnInit {
  @ViewChild('cameraVideo')
  private cameraVideo: ElementRef = {} as ElementRef
  @ViewChild('screenshotCanvas')
  private screenshotCanvas: ElementRef = {} as ElementRef

  videoWidth: number = 0;
  videoHeight: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Initialize camera feed
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const videoElement = this.cameraVideo.nativeElement;
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        this.videoWidth = videoElement.videoWidth;
        this.videoHeight = videoElement.videoHeight;
      };
    }).catch((error) => {
      console.error('Error accessing camera:', error);
    });
  }

  takeScreenshot() {
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
    const x = alignmentFrameRect.left - videoElement.getBoundingClientRect().left;
    const y = alignmentFrameRect.top - videoElement.getBoundingClientRect().top;
    const width = alignmentFrameRect.width;
    const height = alignmentFrameRect.height;

    // Capture the screenshot within the alignment frame
    const screenshot = ctx.getImageData(x, y, width, height);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Resize the canvas to match the frame's dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw the captured region onto the canvas
    ctx.putImageData(screenshot, 0, 0);
  }
}
