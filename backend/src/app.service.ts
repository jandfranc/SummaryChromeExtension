// Import necessary modules and components.
import { Injectable } from '@nestjs/common';
import { SummaryService } from './summary/summary.service';
import { Summary } from './summary/summary.schema';

// Declare the service as an injectable class with the `@Injectable` decorator.
@Injectable()
export class AppService {
  constructor(private readonly summaryService: SummaryService) { }

  // Define the `generateSummary` method, which takes in a string of `text` and returns a Promise that resolves to a `Summary`.
  async generateSummary(text: string): Promise<Summary> {
    return this.summaryService.generateSummary(text);
  }
}
