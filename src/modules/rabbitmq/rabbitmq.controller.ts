
import { Controller, Get } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get('test')
  async testSendMessage() {
    const message = { data: 'Test message' };
    await this.rabbitmqService.sendMessage(message);
    return 'Message sent';
  }
}
