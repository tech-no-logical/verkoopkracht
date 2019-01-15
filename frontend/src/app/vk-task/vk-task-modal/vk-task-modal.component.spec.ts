import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkTaskModalComponent } from './vk-task-modal.component';

describe('VkTaskModalComponent', () => {
  let component: VkTaskModalComponent;
  let fixture: ComponentFixture<VkTaskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkTaskModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
