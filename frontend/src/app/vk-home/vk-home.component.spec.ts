import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkHomeComponent } from './vk-home.component';

describe('VkHomeComponent', () => {
  let component: VkHomeComponent;
  let fixture: ComponentFixture<VkHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
