import { TestBed, inject } from '@angular/core/testing';

import { VkPersonService } from './vk-person.service';

describe('VkPersonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VkPersonService]
    });
  });

  it('should be created', inject([VkPersonService], (service: VkPersonService) => {
    expect(service).toBeTruthy();
  }));
});
