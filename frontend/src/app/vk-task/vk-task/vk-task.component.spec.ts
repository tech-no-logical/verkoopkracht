import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkTaskComponent } from './vk-task.component';

describe('VkTaskComponent', () => {
  let component: VkTaskComponent;
  let fixture: ComponentFixture<VkTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
