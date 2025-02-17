import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  providers: [ProducerService],
  controllers: [ProducerController],
  exports: [ProducerService],
})
export class ProducerModule {}
