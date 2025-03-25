import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'backlog' | 'inProgress' | 'done';
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private getTasksCollection() {
    const currentUser = this.authService.currentUserSig();
    if (!currentUser || !currentUser.uid) {
      throw new Error('User not logged in.');
    }
    return collection(this.firestore, `users/${currentUser.uid}/tasks`);
  }

  addTask(task: Task): Promise<any> {
    const tasksRef = this.getTasksCollection();
    return addDoc(tasksRef, task);
  }

  updateTask(taskId: string, updatedTask: Partial<Task>): Promise<void> {
    const taskDoc = doc(
      this.firestore,
      `users/${this.authService.currentUserSig()?.uid}/tasks/${taskId}`
    );
    return updateDoc(taskDoc, updatedTask);
  }

  deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(
      this.firestore,
      `users/${this.authService.currentUserSig()?.uid}/tasks/${taskId}`
    );
    return deleteDoc(taskDoc);
  }

  getTasks(): Observable<Task[]> {
    const tasksRef = this.getTasksCollection();
    return collectionData(tasksRef, { idField: 'id' }) as Observable<Task[]>;
  }
}
