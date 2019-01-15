import { TestBed, inject } from '@angular/core/testing';

import { VkService } from './vk.service';

describe('VkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VkService]
    });
  });

  it('should be created', inject([VkService], (service: VkService) => {
    expect(service).toBeTruthy();
  }));
});
