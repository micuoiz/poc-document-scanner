import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasComponent } from "./components/canvas/canvas.component";
import { NativeComponent } from "./components/native/native.component";
import { OpencvComponent } from "./components/opencv/opencv.component";
import { FrameAdjustComponent } from "./components/frame-adjust/frame-adjust.component";


const routes: Routes = [
  { path: "canvas", component: CanvasComponent },
  { path: "native", component: NativeComponent },
  { path: "opencv", component: OpencvComponent },
  { path: "frame", component: FrameAdjustComponent },
  { path: "**", redirectTo: 'canvas', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
