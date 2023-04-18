// Import necessary modules and components.
import { Document } from 'mongoose';

// Declare the interface for a `Summary` object.
export interface Summary {
    text: string;
    summary: string;
    date: Date;
    tags: string[];
}

// Define the `SummaryDocument` as a `Summary` object with a `Document` type.
export type SummaryDocument = Summary & Document;
