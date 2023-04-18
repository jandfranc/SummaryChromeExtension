import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Summary } from './summary.schema';
import { Configuration, OpenAIApi } from "openai";

@Injectable()
export class SummaryService {
    constructor(
        @InjectModel('Summary') private readonly summaryModel: Model<Summary>,
    ) { }

    async create(summary: Summary): Promise<Summary> {
        const savedSummary = await summary.save();
        return savedSummary;
    }


    async findAll(): Promise<Summary[]> {
        return this.summaryModel.find().exec();
    }


    async generateSummary(text: string): Promise<Summary> {
        const openaiApiSecretKey = process.env.OPENAI_API_SECRET_KEY;
        if (!openaiApiSecretKey) {
            throw new Error('OpenAI API secret key not found in environment variables');
        }

        const configuration = new Configuration({
            apiKey: openaiApiSecretKey
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: 'You generate short summaries of text passed to you. You are not an assistant. ALl you do is create summaries from the provided text. The text provided to you will be of the form: "TEXT TO SUMMARISE: [summarise this text]' },
            { role: "user", content: "TEXT TO SUMMARISE: " + text }],
        });

        const generatedSummary = completion.data.choices[0].message.content;

        const summaryData = {
            text: text,
            summary: generatedSummary,
            date: new Date(),
            tags: [],
        };

        const summaryObject = new this.summaryModel(summaryData);

        return this.create(summaryObject);
    }
}
