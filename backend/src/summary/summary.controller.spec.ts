// Import necessary modules and components.
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import SummaryController from './summary.controller';
import { SummaryService } from './summary.service';
import SummarySchema from './summary.schema';

// Define the test suite for the `SummaryController`.
describe('SummaryController', () => {
  let controller: SummaryController;

  beforeEach(async () => {
    // Set up a test module with the `SummaryController`, `SummaryService`, and `SummarySchema`.
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
        MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }]),
      ],
      controllers: [SummaryController],
      providers: [SummaryService],
    }).compile();

    // Get the instance of the `SummaryController` for each test.
    controller = module.get<SummaryController>(SummaryController);
  });

  // Define a test case to check if the `SummaryController` is defined.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
