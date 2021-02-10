import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { TextAdventureComponent } from './text-adventure/text-adventure.component';
import { ItemTestComponent } from './item-test/item-test.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DebugComponent } from './debug/debug.component';

@NgModule({
  declarations: [
    AppComponent,
    TextAdventureComponent,
    ItemTestComponent,
    DebugComponent,
  ],
  imports: [
    RouterModule.forRoot([
      { path: 'item-test', component: ItemTestComponent },
      { path: 'text-adventure', component: TextAdventureComponent },
      { path: 'debug', component: DebugComponent },
      { path: '', redirectTo: 'debug', pathMatch: 'full' }
    ]),
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    FontAwesomeModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
