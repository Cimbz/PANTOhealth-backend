import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from 'src/modules/rabbitmq/rabbitmq.module';
// import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: Joi.object({}),
    }),
    RabbitmqModule,
  ],
})
export class AppModule {}
