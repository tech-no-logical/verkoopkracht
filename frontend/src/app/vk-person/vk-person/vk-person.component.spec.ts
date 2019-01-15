import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkPersonComponent } from './vk-person.component';

describe('VkPersonComponent', () => {
  let component: VkPersonComponent;
  let fixture: ComponentFixture<VkPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
