import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin', description: 'Tên người dùng của admin' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  username: string;

  @ApiProperty({ example: 'admin123', description: 'Mật khẩu của admin' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}