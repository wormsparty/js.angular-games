import { Routes } from '@angular/router';
import { TextAdventureComponent } from './text-adventure/text-adventure.component';

export const routes: Routes = [
      { path: 'text-adventure', component: TextAdventureComponent },
      { path: '', redirectTo: 'text-adventure', pathMatch: 'full' }
];
