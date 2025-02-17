import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('producer')
export class ProducerController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Get('generate-random-xray')
  async triggerDataSend() {
    const result = await this.producerService.simulateXRayData();
    return result;
  }

  @Post('send-xray')
  @ApiBody({
    description: 'send xray data',
  })
  async sendXRayData(@Body() xrayData: Record<string, any>) {
    await this.rabbitmqService.sendMessage(xrayData);
    return { status: 'success', receivedData: xrayData };
  }
}
