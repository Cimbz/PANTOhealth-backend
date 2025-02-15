import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly amqpUrl: string;
  private readonly queueName: string;
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(RabbitmqService.name);


  constructor() {
    this.amqpUrl = process.env.RABBITMQ_URL || '';
    this.queueName = process.env.RABBITMQ_QUEUE || '';
    
    if (!this.amqpUrl || !this.queueName) {
      throw new Error('RABBITMQ_URL or RABBITMQ_QUEUE is not defined.');
    }
}
    

  async onModuleInit() {
   try
   { await this.connectToRabbitMQ();
    await this.assertQueues();
    this.consumeXRayData();
  }
  catch(error){
    this.logger.error('Failed to initialize RabbitMQ:', error);
  }
  }

  async onModuleDestroy() {
    try {
    await this.channel.close();
    await this.connection.close();
  } catch (error) {
    this.logger.error('Error closing RabbitMQ:', error);
  }
  }

  private async connectToRabbitMQ() {
    try {
    this.connection = await amqp.connect(this.amqpUrl);
    this.channel = await this.connection.createChannel();
  } catch (error) {
    this.logger.error("Failed to connect to RabbitMQ: ", error);
    }
  }

  private async assertQueues() {
    try {
    await this.channel.assertQueue(this.queueName, { durable: true });
  } catch (error) {
    this.logger.error('Failed to assert queue:', error);
    throw error;
  }
  }

  private consumeXRayData() {
    try {
    this.channel.consume(this.queueName, (msg) => {
      if (msg !== null) {
        console.log('Received:', msg.content.toString());
        this.channel.ack(msg);
      }
    });
  } catch (error) {
    this.logger.error('Failed to process message:', error);
    throw error;
    }
  }

  public async sendMessage(message: any) {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel not initialized.');
      }
    await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    this.logger.error('Error sending message:', error);
    throw error;
  }
  }

}
