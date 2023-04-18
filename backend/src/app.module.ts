// Import the required Nest.js modules and components.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import SummaryController from './summary/summary.controller';
import { AppService } from './app.service';
import { SummaryModule } from './summary/summary.module';

// Define the AppModule, which is the root module of the application.
@Module({
  // Import the necessary modules, including the ConfigModule for loading configuration from environment variables,
  // the MongooseModule for connecting to a MongoDB database, and the SummaryModule for handling summary-related requests.
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
    SummaryModule,
  ],
  // Declare the controllers that handle incoming requests, including the AppController for general application requests
  // and the SummaryController for summary-related requests.
  controllers: [AppController, SummaryController],
  // Declare the services that provide business logic to the controllers and other components.
  providers: [AppService],
})
export class AppModule { }
