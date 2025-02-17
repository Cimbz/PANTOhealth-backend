import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProducerService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly amqpUrl: string;
  private readonly queueName: string;
  private readonly logger = new Logger(ProducerService.name);

  constructor() {
    this.amqpUrl = process.env.RABBITMQ_URL || '';
    this.queueName = process.env.RABBITMQ_QUEUE || '';

    if (!this.amqpUrl || !this.queueName) {
      throw new Error('RABBITMQ_URL or RABBITMQ_QUEUE is not defined.');
    }
  }

  async onModuleInit() {
    await this.connectToRabbitMQ();
    if (process.env.AUTO_MODE === 'true') {
      this.logger.log('Auto-mode enabled: Generating data automatically.');
      this.startDataGeneration();
    } else {
      this.logger.log(
        'Manual mode enabled: Use /producer/simulate-xray to generate data.',
      );
    }
  }

  private async connectToRabbitMQ() {
    try {
      this.connection = await amqp.connect(this.amqpUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      this.logger.log('RabbitMQ Producer connected and queue asserted.');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  private startDataGeneration() {
    const interval = parseInt(process.env.PRODUCER_INTERVAL_MS as string);
    setInterval(() => {
      const message = this.generateXRayData();
      this.sendMessage(message);
    }, interval);
  }

  public async simulateXRayData() {
    const message = this.generateXRayData();
    this.sendMessage(message);
    return { message: 'Manual x-ray data sent successfully', data: message };
  }

  private generateXRayData(): Record<string, any> {
    const deviceId = new ObjectId().toString();
    const time = Date.now();
    const data = Array.from({ length: 5 }, (_, i) => [
      i * 1000,
      [this.getRandomCoord(), this.getRandomCoord(), this.getRandomSpeed()],
    ]);

    return {
      [deviceId]: {
        data,
        time,
      },
    };
  }

  private getRandomCoord(): number {
    return parseFloat((51.339764 + Math.random() * 0.01).toFixed(6));
  }

  private getRandomSpeed(): number {
    return parseFloat((1 + Math.random() * 5).toFixed(2));
  }

  private async sendMessage(message: Record<string, any>) {
    try {
      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
      );
      this.logger.log(`Sent x-ray data: ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error('Failed to send message:', error);
    }
  }
}
