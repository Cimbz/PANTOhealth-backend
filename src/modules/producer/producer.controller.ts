import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Get('simulate-xray')
  async triggerDataSend() {
    const result = await this.producerService.simulateXRayData();
    return result;
  }
}
