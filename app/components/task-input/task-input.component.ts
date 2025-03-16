import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'task-input',
  standalone: true,
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.css'],
  imports: [FormsModule],
})
export class TaskInputComponent {
  newTask = ''; 
  @Output() taskAdded = new EventEmitter<string>(); // Emits new task to parent

  addTask() {
    if (this.newTask.trim()) {
      this.taskAdded.emit(this.newTask); // Send task to parent
      this.newTask = ''; // Clear input field
    }
  }
}
