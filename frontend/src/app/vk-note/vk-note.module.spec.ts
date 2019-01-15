import { VkNoteModule } from './vk-note.module';

describe('VkNoteModule', () => {
  let vkNoteModule: VkNoteModule;

  beforeEach(() => {
    vkNoteModule = new VkNoteModule();
  });

  it('should create an instance', () => {
    expect(vkNoteModule).toBeTruthy();
  });
});
