import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkPersonsComponent } from './vk-persons.component';

describe('VkPersonsComponent', () => {
  let component: VkPersonsComponent;
  let fixture: ComponentFixture<VkPersonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkPersonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
