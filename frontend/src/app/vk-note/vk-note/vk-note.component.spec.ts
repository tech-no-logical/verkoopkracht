import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkNoteComponent } from './vk-note.component';

describe('VkNoteComponent', () => {
  let component: VkNoteComponent;
  let fixture: ComponentFixture<VkNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
