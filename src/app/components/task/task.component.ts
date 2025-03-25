import { Component } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-task',
  imports: [
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '250px',
      data: {
        taskTitle: this.taskTitle,
        taskDescription: this.taskDescription,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskTitle = result.taskTitle;
        this.taskDescription = result.taskDescription;
        this.addTask();
      }
    });
  }

  backlog: { title: string; description: string }[] = [];
  inProgress: { title: string; description: string }[] = [];
  done: { title: string; description: string }[] = [];

  taskTitle: string = '';
  taskDescription: string = '';

  drop(event: CdkDragDrop<{ title: string; description: string }[]>) {
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

  addTask() {
    if (this.taskTitle && this.taskDescription) {
      this.backlog.push({
        title: this.taskTitle,
        description: this.taskDescription,
      });
      this.taskTitle = '';
      this.taskDescription = '';
    }
  }
  deleteTask(list: string, task: { title: string; description: string }) {
    if (list === 'backlog') {
      const index = this.backlog.indexOf(task);
      if (index > -1) {
        this.backlog.splice(index, 1);
      }
    } else if (list === 'inProgress') {
      const index = this.inProgress.indexOf(task);
      if (index > -1) {
        this.inProgress.splice(index, 1);
      }
    } else if (list === 'done') {
      const index = this.done.indexOf(task);
      if (index > -1) {
        this.done.splice(index, 1);
      }
    }
  }
}
