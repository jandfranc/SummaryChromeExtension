// src/summary/summary.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import SummaryController from './summary.controller';
import { SummaryService } from './summary.service';
import SummarySchema from './summary.schema';

describe('SummaryController', () => {
  let controller: SummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
        MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }]),
      ],
      controllers: [SummaryController],
      providers: [SummaryService],
    }).compile();

    controller = module.get<SummaryController>(SummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
