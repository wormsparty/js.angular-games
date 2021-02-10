import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { TextAdventureComponent } from './text-adventure/text-adventure.component';
import { ItemTestComponent } from './item-test/item-test.component';

@NgModule({
  declarations: [
    AppComponent,
    TextAdventureComponent,
    ItemTestComponent,
  ],
  imports: [
    RouterModule.forRoot([
      { path: 'item-test', component: ItemTestComponent },
      { path: 'text-adventure', component: TextAdventureComponent },
      { path: '', redirectTo: 'item-test', pathMatch: 'full' }
    ]),
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
