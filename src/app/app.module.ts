import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatMenuModule, MatIconModule } from '@angular/material';
import { AppComponent } from './app.component';
import { TextAdventureComponent } from './text-adventure/text-adventure.component';
import { BoccaliCarteComponent } from './boccali-carte/boccali-carte.component';

@NgModule({
  declarations: [
    AppComponent,
    BoccaliCarteComponent,
    TextAdventureComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
