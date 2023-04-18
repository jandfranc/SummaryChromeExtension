import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Summary } from './summary/summary.schema';

@Controller('summary/summaries')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  async generateSummary(@Body() body: { text: string }): Promise<Summary> {
    return this.appService.generateSummary(body.text);
  }
}


