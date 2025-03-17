import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main-view',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    NgFor,
    DragDropModule,
  ],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss',
})
export class MainViewComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]); // Redireciona para a página correta
  }

  board: Board = new Board('test Board', [
    new Column('Ideas', ['Some random idea', 'Vai tomando', 'BTC']),
    new Column('In Progress', [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep',
    ]),
    new Column('Done', [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog',
    ]),
  ]);

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
