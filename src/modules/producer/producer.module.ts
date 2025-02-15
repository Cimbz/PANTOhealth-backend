import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

@Module({
  providers: [ProducerService],
  controllers: [ProducerController],
  exports: [ProducerService],
})
export class ProducerModule {}
