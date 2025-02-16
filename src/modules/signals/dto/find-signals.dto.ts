import { CoreOutput } from 'src/common/entities/output.dto';
import { XRaySignalEntity } from '../entities/signals.entity';
import { IsString } from 'class-validator';
import { ID_MUST_BE_STRING } from 'src/common/constants/common_message';

export class FindSignalByIdInput {
    @IsString({message: ID_MUST_BE_STRING})
    id: string;
}

export class FindSignalOutput extends CoreOutput {
  results?: XRaySignalEntity;
}
