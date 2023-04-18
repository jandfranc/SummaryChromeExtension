// Import necessary modules and components.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import SummaryController from './summary.controller';
import { SummaryService } from './summary.service';
import SummarySchema from './summary.schema';

// Declare the module as a class with the `@Module` decorator.
@Module({
  // Import the `MongooseModule` using `forFeature` and pass in the `SummarySchema`.
  imports: [MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }])],
  // Declare the controllers that should be available in the module.
  controllers: [SummaryController],
  // Declare the providers that should be available in the module.
  providers: [SummaryService],
  // Export the `SummaryService` to make it available to other modules.
  exports: [SummaryService],
})
export class SummaryModule { }
