import { TestBed, inject } from '@angular/core/testing';

import { VkTaskService } from './vk-task.service';

describe('VkTaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VkTaskService]
    });
  });

  it('should be created', inject([VkTaskService], (service: VkTaskService) => {
    expect(service).toBeTruthy();
  }));
});
