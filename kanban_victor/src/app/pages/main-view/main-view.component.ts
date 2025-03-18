import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Board } from '../../models/board.model';
import { Column } from '../../models/column.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
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
    this.router.navigate([path]);
  }

  board: Board = new Board('test Board', [
    new Column('Ideas', []),
    new Column('In Progress', []),
    new Column('Done', []),
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

  newTask: string = '';

  addTask() {
    if (this.newTask.trim()) {
      // Procura a coluna "Ideas"
      const ideasColumn = this.board.columns.find(
        (col) => col.name === 'Ideas'
      );

      if (ideasColumn) {
        ideasColumn.tasks.push(this.newTask.trim());
        this.newTask = ''; // Limpa o input
      }
    }
  }

  deleteTask(column: Column, taskIndex: number) {
    column.tasks.splice(taskIndex, 1);
  }
}
