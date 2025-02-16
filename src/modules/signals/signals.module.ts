import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XRaySignalEntity, XRaySignalSchema } from './entities/signals.entity';
import { SignalsService } from './signals.service';
import { SignalRepository } from './signals.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: XRaySignalEntity.name, schema: XRaySignalSchema },
    ]),
  ],
  providers: [SignalsService, SignalRepository],
  exports: [SignalsService],
})
export class SignalsModule {}
