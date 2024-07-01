import { OmitType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './create-staff.dto';

export class UpdateStaffDto extends OmitType(CreateStaffDto, [
  'schedule',
] as const) {}
