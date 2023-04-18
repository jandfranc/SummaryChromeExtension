import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import SummaryController from './summary/summary.controller';
import { AppService } from './app.service';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
    SummaryModule,
  ],
  controllers: [AppController, SummaryController],
  providers: [AppService],
})
export class AppModule { }
