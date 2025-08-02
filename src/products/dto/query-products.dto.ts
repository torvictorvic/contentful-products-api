import { IsInt, IsOptional, IsString, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductsDto {
  @Type(() => Number) @IsInt() @IsOptional() page = 1;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsNumberString() minPrice?: string;
  @IsOptional() @IsNumberString() maxPrice?: string;
}
