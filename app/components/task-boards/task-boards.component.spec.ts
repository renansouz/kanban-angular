import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoardsComponent } from './task-boards.component';

describe('TaskBoardsComponent', () => {
  let component: TaskBoardsComponent;
  let fixture: ComponentFixture<TaskBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
