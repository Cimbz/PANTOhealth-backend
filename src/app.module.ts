import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from 'src/modules/rabbitmq/rabbitmq.module';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SignalsModule } from './modules/signals/signals.module';
import { ProducerModule } from './modules/producer/producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    RabbitmqModule,
    SignalsModule,
    ProducerModule,
  ],
  providers: [AppService],
})
export class AppModule {}
