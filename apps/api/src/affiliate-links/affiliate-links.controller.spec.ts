import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateLinksController } from './affiliate-links.controller';

describe('AffiliateLinksController', () => {
  let controller: AffiliateLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateLinksController],
    }).compile();

    controller = module.get<AffiliateLinksController>(AffiliateLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
