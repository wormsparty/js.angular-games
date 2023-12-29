import { Routes } from '@angular/router';
import { TextAdventureComponent } from './text-adventure/text-adventure.component';
import { ItemTestComponent } from './item-test/item-test.component';

export const routes: Routes = [
      { path: 'item-test', component: ItemTestComponent },
      { path: 'text-adventure', component: TextAdventureComponent },
      { path: '', redirectTo: 'text-adventure', pathMatch: 'full' }
];
