import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { SignalsModule } from '../signals/signals.module';

@Module({
  imports: [SignalsModule],
  providers: [RabbitmqService],
  controllers: [RabbitmqController],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
