import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkTasksComponent } from './vk-tasks.component';

describe('VkTasksComponent', () => {
  let component: VkTasksComponent;
  let fixture: ComponentFixture<VkTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
