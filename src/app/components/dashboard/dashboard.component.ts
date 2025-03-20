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
  selector: 'app-dashboard',
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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  board: Board = new Board('test Board', [
    new Column('Ideas', []),
    new Column('In Progress', []),
    new Column('Done', []),
  ]);

  drop(event: CdkDragDrop<{ name: string; description: string }[]>) {
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

  newTaskName: string = '';
  newTaskDescription: string = '';

  addTask() {
    if (this.newTaskName.trim()) {
      const ideasColumn = this.board.columns.find(
        (col) => col.name === 'Ideas'
      );
      if (ideasColumn) {
        ideasColumn.tasks.push({
          name: this.newTaskName.trim(),
          description: this.newTaskDescription.trim(),
        });

        this.newTaskName = '';
        this.newTaskDescription = '';
      }
    }
  }

  deleteTask(column: Column, taskIndex: number) {
    column.tasks.splice(taskIndex, 1);
  }
}
