import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRaySignalEntity } from './entities/signals.entity';
import { CreateXRaySignalInput } from './dto/create-signals.dto';

@Injectable()
export class SignalRepository {
  constructor(
    @InjectModel(XRaySignalEntity.name)
    private readonly signalModel: Model<XRaySignalEntity>,
  ) {}

  async create(input: CreateXRaySignalInput): Promise<void> {
    const newXRaySignal = new this.signalModel(input);
    await newXRaySignal.save();
  }

  async bulkInsert(inputs: CreateXRaySignalInput[]): Promise<void> {
    await this.signalModel.insertMany(inputs);
  }

  async getAllSignals(): Promise<XRaySignalEntity[]> {
    return this.signalModel.find().exec();
 }
 
}
