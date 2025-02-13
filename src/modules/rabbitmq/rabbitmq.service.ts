import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly amqpUrl: string;
  private readonly queueName: string;
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.amqpUrl = process.env.RABBITMQ_URL || '';
    this.queueName = process.env.RABBITMQ_QUEUE || '';
    
    if (!this.amqpUrl || !this.queueName) {
      throw new Error('RABBITMQ_URL or RABBITMQ_QUEUE is not defined.');
    }
}
    

  async onModuleInit() {
    await this.connectToRabbitMQ();
    await this.assertQueues();
    this.consumeXRayData();
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  private async connectToRabbitMQ() {
    this.connection = await amqp.connect(this.amqpUrl);
    this.channel = await this.connection.createChannel();
  }

  private async assertQueues() {
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  private consumeXRayData() {
    this.channel.consume(this.queueName, (msg) => {
      if (msg !== null) {
        console.log('Received:', msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  public async sendMessage(message: any) {
    await this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)));
  }
}
