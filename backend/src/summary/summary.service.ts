// Import necessary modules and components.
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Summary } from './summary.schema';
import { Configuration, OpenAIApi } from "openai";

// Declare the service as an injectable class with the `@Injectable` decorator.
@Injectable()
export class SummaryService {
    constructor(
        @InjectModel('Summary') private readonly summaryModel: Model<Summary>,
    ) { }

    // Define the `create` method, which saves a new `Summary` object to the database and returns the saved object.
    async create(summary: Summary): Promise<Summary> {
        const savedSummary = await summary.save();
        return savedSummary;
    }

    // Define the `findAll` method, which returns an array of all `Summary` objects in the database.
    async findAll(): Promise<Summary[]> {
        return this.summaryModel.find().exec();
    }

    // Define the `generateSummary` method, which uses the OpenAI API to generate a summary of a given `text` string and saves the result to the database.
    async generateSummary(text: string): Promise<Summary> {
        // Get the OpenAI API secret key from environment variables.
        const openaiApiSecretKey = process.env.OPENAI_API_SECRET_KEY;
        if (!openaiApiSecretKey) {
            throw new Error('OpenAI API secret key not found in environment variables');
        }

        // Configure the OpenAI API client with the secret key.
        const configuration = new Configuration({
            apiKey: openaiApiSecretKey
        });
        const openai = new OpenAIApi(configuration);

        // Generate the summary using the OpenAI API.
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: 'You generate short summaries of text passed to you. You are not an assistant. ALl you do is create summaries from the provided text. The text provided to you will be of the form: "TEXT TO SUMMARISE: [summarise this text]' },
            { role: "user", content: "TEXT TO SUMMARISE: " + text }],
        });

        // Extract the generated summary from the API response.
        const generatedSummary = completion.data.choices[0].message.content;

        // Create a new `Summary` object with the generated summary and other data, and save it to the database.
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
