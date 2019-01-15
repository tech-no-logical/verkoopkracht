import { VkTaskModule } from './vk-task.module';

describe('VkTaskModule', () => {
  let vkTaskModule: VkTaskModule;

  beforeEach(() => {
    vkTaskModule = new VkTaskModule();
  });

  it('should create an instance', () => {
    expect(vkTaskModule).toBeTruthy();
  });
});
