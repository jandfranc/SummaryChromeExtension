// Import necessary modules, components, and testing utilities.
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummaryService } from './summary/summary.service';
import { Summary } from './summary/summary.schema';
import * as supertest from 'supertest';
import SummaryController from './summary/summary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import SummarySchema from './summary/summary.schema';
import { INestApplication } from '@nestjs/common';

// Define a test suite for the `AppController`.
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let summaryService: SummaryService;

  // Set up the application and the `SummaryService` component for each test case.
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
        MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }]),
      ],
      controllers: [AppController],
      providers: [AppService, SummaryService],
    }).compile();

    app = moduleRef.createNestApplication();
    summaryService = moduleRef.get<SummaryService>(SummaryService);
    await app.init();
  });

  // Clean up the application after each test case.
  afterEach(async () => {
    await app.close();
  });

  // Define a test case for the `/summary/summaries` endpoint with an HTTP POST request.
  it('/summary/summaries (POST) should generate a summary', async () => {
    const text = 'This is a sample text that needs to be summarized.';

    // Define a partial summary object that will be returned by the `SummaryService`.
    const summary: Partial<Summary> = {
      _id: '1',
      text: text,
      summary: 'Sample summary',
      date: new Date(),
      tags: [],
    };

    // Use Jest to spy on the `generateSummary` method of the `SummaryService` and return the defined partial summary object.
    jest.spyOn(summaryService, 'generateSummary').mockImplementation(async () => summary as Summary);

    // Send an HTTP POST request to the `/summary/summaries` endpoint with the `text` field in the request body.
    // Expect a 201 HTTP status code and a response body that matches the defined partial summary object.
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post('/summary/summaries')
      .send({ text })
      .expect(201);

    expect(body).toMatchObject({
      _id: '1',
      text: text,
      summary: 'Sample summary',
      tags: [],
    });
  });
});
