import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { PfcmComponent } from "./pfcm/pfcm.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material/material.module';
import { FormGroup } from '@angular/forms';
import { PicmComponent } from './picm/picm.component';

@NgModule({
    declarations: [
      PfcmComponent,
      WelcomeComponent,
      PicmComponent,
    ],
    imports: [
      CommonModule,
      BrowserAnimationsModule,
      MaterialModule,
      ReactiveFormsModule,

    ],
    exports: [
      PfcmComponent,
      WelcomeComponent,
      PicmComponent,
    ],
    providers: [],
})

export class ComponentsModule {}
