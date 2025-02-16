import { PartialType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/common/entities/output.dto';
import { CreateXRaySignalInput } from './create-signals.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ID_IS_EMPTY, ID_MUST_BE_STRING } from 'src/common/constants/common_message';

export class UpdateSignalInput extends PartialType(CreateXRaySignalInput) {
    @IsNotEmpty({message: ID_IS_EMPTY})
    @IsString({message: ID_MUST_BE_STRING})
    id: string;
}

export class UpdateSignalOutput extends CoreOutput {}
