import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkNotesComponent } from './vk-notes.component';

describe('VkNotesComponent', () => {
  let component: VkNotesComponent;
  let fixture: ComponentFixture<VkNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
