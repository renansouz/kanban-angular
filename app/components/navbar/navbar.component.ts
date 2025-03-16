import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TaskInputComponent } from '../task-input/task-input.component'; // Import TaskInputComponent
import { TaskBoardsComponent } from '../task-boards/task-boards.component'; // Import TaskBoardComponent
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    TaskInputComponent, // Include TaskInput
    TaskBoardsComponent,  // Include TaskBoard
    MatExpansionModule,
  ],
})
export class NavbarComponent {
  isOpen = false;
  tasks: string[] = []; // Store tasks

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  addTask(task: string) {
    this.tasks.push(task); // Add task dynamically
  }
}
