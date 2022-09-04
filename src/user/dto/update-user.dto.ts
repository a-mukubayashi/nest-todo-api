import { IsOptional, IsString } from 'class-validator';

// nicknameの更新
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickName?: string;
}
