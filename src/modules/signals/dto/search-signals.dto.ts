import { CoreOutput } from 'src/common/entities/output.dto';
import { XRaySignalEntity } from '../entities/signals.entity';
import { IsOptional } from 'class-validator';

export class SearchSignalsInput {
  @IsOptional()
  deviceId?: string;

  @IsOptional()
  dataLength?: number;

}

export class SearchSignalsOutput extends CoreOutput {
  results?: XRaySignalEntity[];
}
