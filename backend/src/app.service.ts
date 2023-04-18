import { Injectable } from '@nestjs/common';
import { SummaryService } from './summary/summary.service';
import { Summary } from './summary/summary.schema';

@Injectable()
export class AppService {
  constructor(private readonly summaryService: SummaryService) { }

  async generateSummary(text: string): Promise<Summary> {
    return this.summaryService.generateSummary(text);
  }
}
