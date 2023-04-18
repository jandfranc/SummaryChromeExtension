// Import the necessary modules from Mongoose.
import { Schema, Document } from 'mongoose';

// Define the `Summary` interface as a `Document` that extends from Mongoose's `Document` class.
export interface Summary extends Document {
    text: string;
    summary: string;
    date: Date;
    tags: string[];
}

// Create a new Mongoose schema for the `Summary` model using the `Schema` constructor.
const SummarySchema = new Schema<Summary>({
    // Define the schema fields for the `Summary` model using Mongoose's schema types.
    text: { type: String, required: true },
    summary: { type: String, required: true },
    date: { type: Date, required: true },
    tags: { type: [String], required: true },
});

// Export the `SummarySchema` as the default export of this module.
export default SummarySchema;
