// src/app.controller.spec.ts

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

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let summaryService: SummaryService;

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



  afterEach(async () => {
    await app.close();
  });

  it('/summary/summaries (POST) should generate a summary', async () => {
    const text = 'This is a sample text that needs to be summarized.';


    const summary: Partial<Summary> = {
      _id: '1',
      text: text,
      summary: 'Sample summary',
      date: new Date(),
      tags: [],
    };

    jest.spyOn(summaryService, 'generateSummary').mockImplementation(async () => summary as Summary);
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
