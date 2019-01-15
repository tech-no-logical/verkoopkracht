import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkTypeaheadComponent } from './vk-typeahead.component';

describe('VkTypeaheadComponent', () => {
  let component: VkTypeaheadComponent;
  let fixture: ComponentFixture<VkTypeaheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
