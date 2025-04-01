import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, query, where, DocumentData, deleteDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

interface Column {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    DragDropModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  tasksSubscription?: Subscription;
  user = this.auth.currentUser;
  isFormOpen: boolean = false;

  taskForm: FormGroup;

  constructor() {
    // Initialize the FormGroup with taskTitle and taskDescription
    this.taskForm = new FormGroup({
      taskTitle: new FormControl('', [Validators.required]),  // Task title must be filled
      taskDescription: new FormControl('', [Validators.required])  // Task description must be filled
    });
  }
  columns: Column[] = [
    { name: 'Ideas', tasks: [] },
    { name: 'In progress', tasks: [] },
    { name: 'Done', tasks: [] },
  ];

  ngOnInit() {
    this.loadTasks();
  }

  async addTask() {
    if (this.taskForm.valid) {
      if (!this.user) return;
      const taskTitle = this.taskForm.get('taskTitle')?.value;
      const taskDescription = this.taskForm.get('taskDescription')?.value;

      const newTask = {
        id: Math.random().toString(36).substr(2, 9),  // Generate random ID
        title: taskTitle,
        description: taskDescription,
        createdAt: new Date(),
        userId: this.user.uid,  // Replace with actual user ID
        column: this.columns[0].name
      };

      const tasksCollection = collection(this.firestore, `users/${this.user.uid}/tasks`);

      try {
        await addDoc(tasksCollection, newTask).then(() => this.hideTaskForm());
      } catch (error) {
        console.error('Error adding task:', error);
      };
      
      // Add to the "Ideas" column in the frontend
      this.columns[0].tasks.push(newTask);

      console.log('New Task:', newTask);
      this.taskForm.reset();
    } else {
      console.log('Please fill in both fields.');
    }
  }

  async deleteTask(task: Task, columnName: string) {
    if (!this.user) return;
  
    // Remove from Firestore
    const taskRef = doc(this.firestore, `users/${this.user.uid}/tasks`, task.id);
    await deleteDoc(taskRef);
  
    // Remove from the local UI
    const column = this.columns.find(col => col.name === columnName);
    if (column) {
      column.tasks = column.tasks.filter(t => t.id !== task.id);
    }
  }

  async loadTasks() {
    if (!this.user) return;

    const tasksCollection = collection(this.firestore, `users/${this.user.uid}/tasks`);

    // Unsubscribe from previous subscription to prevent memory leaks
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }

    // Fetch tasks that belong to the current user
    this.tasksSubscription = collectionData(tasksCollection, { idField: 'id' }).subscribe((tasks: DocumentData[]) => {
      this.columns.forEach((column) => (column.tasks = [])); // Clear columns

      // Map the raw data (DocumentData) to Task type
      tasks.forEach((taskData: DocumentData) => {
        const task: Task = {
          id: taskData['id'],
          title: taskData['title'],
          description: taskData['description'],
          createdAt: taskData['createdAt'].toDate(), // Firestore timestamp to JavaScript Date
          userId: taskData['userId'],
          column: taskData['column']
        };

        const column = this.columns.find((col) => col.name === task.column);
        if (column) {
          column.tasks.push(task);
        }
      });
    });
  }

  async drop(event: CdkDragDrop<Task[]>, columnName: string) {
    const task = event.item.data; // Get the dropped task

    if (event.previousContainer === event.container) {
      // Task moved within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Task moved between columns
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the task's column in Firestore
      if (!this.user) return;
      const taskRef = doc(this.firestore, `users/${this.user.uid}/tasks`, task.id);
      await updateDoc(taskRef, { column: columnName });
    }

    // Update the local columns array to reflect the move
    const sourceColumn = this.columns.find(col => col.name === event.previousContainer.id);
    const destinationColumn = this.columns.find(col => col.name === columnName);

    if (sourceColumn && destinationColumn) {
      const movedTask = sourceColumn.tasks.splice(event.previousIndex, 1)[0];
      destinationColumn.tasks.push(movedTask);
    }
  }

  // Show task form popup
  showTaskForm() {
    this.isFormOpen = true;
  }

  // Hide task form popup
  hideTaskForm() {
    this.isFormOpen = false;
  }

  
}
