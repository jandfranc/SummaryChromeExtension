// Import necessary modules and components.
import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Summary } from './summary/summary.schema';

// Declare the controller with the `@Controller` decorator and a route prefix of 'summary/summaries'.
@Controller('summary/summaries')
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Define an HTTP POST endpoint using the `@Post` decorator, which accepts a request body containing a `text` field.
  // This method delegates the actual summary generation to the `AppService` using the `generateSummary` method.
  @Post()
  async generateSummary(@Body() body: { text: string }): Promise<Summary> {
    return this.appService.generateSummary(body.text);
  }
}