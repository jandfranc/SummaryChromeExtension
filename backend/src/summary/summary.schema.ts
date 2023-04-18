import { Schema, Document } from 'mongoose';

export interface Summary extends Document {
    text: string;
    summary: string;
    date: Date;
    tags: string[];
}

const SummarySchema = new Schema<Summary>({
    text: { type: String, required: true },
    summary: { type: String, required: true },
    date: { type: Date, required: true },
    tags: { type: [String], required: true },
});

export default SummarySchema;
