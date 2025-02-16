import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XRaySignalEntity } from './entities/signals.entity';
import { CreateXRaySignalInput } from './dto/create-signals.dto';
import { UpdateSignalInput } from './dto/update-signals.dto';

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
    return await this.signalModel.find().exec();
  }

  async findById(id: string): Promise< XRaySignalEntity | null>{
    return await this.signalModel.findById(id).exec();
  }

  async update({id, ...restOfArgs}: UpdateSignalInput): Promise<void> {
    await this.signalModel.findByIdAndUpdate(id, restOfArgs, { new: true }).exec();
  }

 
}
