import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterDto {
  @ApiProperty({ example: 'admin', description: 'Tên người dùng của admin' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email của admin' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'admin123', description: 'Mật khẩu của admin' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Admin User', description: 'Họ tên đầy đủ của admin' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @ApiProperty({ 
    example: 'IT Department', 
    description: 'Phòng ban của admin', 
    required: false 
  })
  @IsOptional()
  department?: string;

  @ApiProperty({ 
    example: 'System Administrator', 
    description: 'Chức vụ của admin', 
    required: false 
  })
  @IsOptional()
  position?: string;
}