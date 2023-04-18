import { Document } from 'mongoose';

export interface Summary {
    text: string;
    summary: string;
    date: Date;
    tags: string[];
}

export type SummaryDocument = Summary & Document;
