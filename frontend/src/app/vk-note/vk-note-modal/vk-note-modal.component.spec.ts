import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkNoteModalComponent } from './vk-note-modal.component';

describe('VkNoteModalComponent', () => {
  let component: VkNoteModalComponent;
  let fixture: ComponentFixture<VkNoteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkNoteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkNoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
