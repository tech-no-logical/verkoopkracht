import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkPersonModalComponent } from './vk-person-modal.component';

describe('VkPersonModalComponent', () => {
  let component: VkPersonModalComponent;
  let fixture: ComponentFixture<VkPersonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkPersonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
