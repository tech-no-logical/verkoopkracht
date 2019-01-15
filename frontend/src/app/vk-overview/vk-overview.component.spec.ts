import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VkOverviewComponent } from './vk-overview.component';

describe('VkOverviewComponent', () => {
  let component: VkOverviewComponent;
  let fixture: ComponentFixture<VkOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VkOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VkOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
