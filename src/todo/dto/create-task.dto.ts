import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// 新しくTaskを作る際にclientから受け取るデータ型
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
