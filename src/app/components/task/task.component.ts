import { Component, OnInit } from '@angular/core';
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
import { Task, TodoService } from '../../services/todo.service';

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
export class TaskComponent implements OnInit {
  constructor(public dialog: MatDialog, private todoService: TodoService) {}
  backlog: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.todoService.getTasks().subscribe((tasks) => {
      this.backlog = tasks.filter((task) => task.status === 'backlog');
      this.inProgress = tasks.filter((task) => task.status === 'inProgress');
      this.done = tasks.filter((task) => task.status === 'done');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '250px',
      data: { taskTitle: '', taskDescription: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newTask: Task = {
          title: result.taskTitle,
          description: result.taskDescription,
          status: 'backlog',
        };
        this.todoService.addTask(newTask);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as 'backlog' | 'inProgress' | 'done';

      if (task.id) {
        this.todoService.updateTask(task.id, { status: newStatus }).then(() => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        });
      }
    }
  }

  deleteTask(list: 'backlog' | 'inProgress' | 'done', task: Task) {
    if (task.id) {
      this.todoService.deleteTask(task.id);
    }
  }
}
