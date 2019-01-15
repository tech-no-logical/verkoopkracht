import { TestBed, inject } from '@angular/core/testing';

import { VkNoteService } from './vk-note.service';

describe('VkNoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VkNoteService]
    });
  });

  it('should be created', inject([VkNoteService], (service: VkNoteService) => {
    expect(service).toBeTruthy();
  }));
});
