// Import the necessary modules and components for testing.
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from './summary.service';
import { Summary } from './summary.schema';

// Define the test suite using Jest's `describe` function.
describe('SummaryService', () => {
  let service: SummaryService;

  // Set up the test environment before each test using Jest's `beforeEach` function.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Declare the providers that should be available to the test environment.
      providers: [
        SummaryService,
        {
          // Use `getModelToken` to provide a mock of the `Summary` model.
          provide: getModelToken('Summary'),
          useValue: {
            // Mock the necessary methods from SummaryModel here.
          },
        },
      ],
    }).compile();

    // Get an instance of the `SummaryService` to test.
    service = module.get<SummaryService>(SummaryService);
  });

  // Write a test case to check if the service is defined using Jest's `it` function.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
