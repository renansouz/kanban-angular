import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'task-board',
  standalone: true,
  templateUrl: './task-boards.component.html',
  styleUrls: ['./task-boards.component.css'],
  imports: [CommonModule, DragDropModule],
})
export class TaskBoardsComponent {
  @Input() tasks: string[] = []; // Define tasks as an input property
  inProgress: string[] = []; // Initialize with an empty array
  done: string[] = []; // Initialize with an empty array

  // Method to handle drop events and transfer tasks
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Reorder items within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer items between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}