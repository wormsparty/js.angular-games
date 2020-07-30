import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule, } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AppComponent } from './app.component';
import { TextAdventureComponent } from './text-adventure/text-adventure.component';
import { ItemTestComponent } from './item-test/item-test.component';
import {CardsComponent} from './cards/cards.component';

@NgModule({
  declarations: [
    AppComponent,
    TextAdventureComponent,
    ItemTestComponent,
    CardsComponent,
  ],
  imports: [
    RouterModule.forRoot([
        { path: 'cards', component: CardsComponent },
        { path: 'item-test', component: ItemTestComponent },
        { path: 'text-adventure', component: TextAdventureComponent },
        { path: '**', component: CardsComponent }
      ],
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
