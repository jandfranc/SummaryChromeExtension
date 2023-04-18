// Import necessary modules and components.
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Summary } from './summary.schema';
import { SummaryService } from './summary.service';

// Declare the controller as a class with the `@Controller` decorator.
@Controller('summary')
export default class SummaryController {
    // Inject the `SummaryService` into the constructor.
    constructor(private readonly summaryService: SummaryService) { }

    // Define a POST endpoint for creating a new summary.
    @Post()
    async create(@Body() summary: Summary): Promise<Summary> {
        return this.summaryService.create(summary);
    }

    // Define a GET endpoint for retrieving all summaries.
    @Get()
    async findAll(): Promise<Summary[]> {
        return this.summaryService.findAll();
    }
}
