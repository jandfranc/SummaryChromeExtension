import { Controller, Get, Post, Body } from '@nestjs/common';
import { Summary } from './summary.schema';
import { SummaryService } from './summary.service';



@Controller('summary')
export default class SummaryController {

    constructor(private readonly summaryService: SummaryService) { }

    @Post()
    async create(@Body() summary: Summary): Promise<Summary> {
        return this.summaryService.create(summary);
    }



    @Get()
    async findAll(): Promise<Summary[]> {
        return this.summaryService.findAll();
    }
}
