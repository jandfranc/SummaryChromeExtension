import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import SummaryController from './summary.controller';
import { SummaryService } from './summary.service';
import SummarySchema from './summary.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }])],
  controllers: [SummaryController],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule { }
