import { Transform } from 'class-transformer';
import { IsArray, IsMongoId, IsString } from 'class-validator';

// multipart/form-data sends a single value as a string and repeated
// fields as an array, so normalize both (and a missing field) to string[].
const toArray = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') return [];
  return Array.isArray(value) ? value : [value];
};

export class CreateApplicationDto {
  @IsMongoId()
  jobId: string;

  @Transform(toArray)
  @IsArray()
  @IsString({ each: true })
  userTechSkills: string[];

  @Transform(toArray)
  @IsArray()
  @IsString({ each: true })
  userSoftSkills: string[];
}