import { VkPersonModule } from './vk-person.module';

describe('VkPersonModule', () => {
  let vkPersonModule: VkPersonModule;

  beforeEach(() => {
    vkPersonModule = new VkPersonModule();
  });

  it('should create an instance', () => {
    expect(vkPersonModule).toBeTruthy();
  });
});
