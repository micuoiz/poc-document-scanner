import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { NativeComponent } from './components/native/native.component';
import { OpencvComponent } from './components/opencv/opencv.component';
import { FrameAdjustComponent } from './components/frame-adjust/frame-adjust.component';
import { ImageCropperModule } from "ngx-image-cropper";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    NativeComponent,
    OpencvComponent,
    FrameAdjustComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ImageCropperModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
