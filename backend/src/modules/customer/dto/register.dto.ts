import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerRegisterDto {
  @ApiProperty({ example: 'johndoe', description: 'Tên đăng nhập của khách hàng' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email của khách hàng' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu của khách hàng' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Họ tên đầy đủ của khách hàng' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @ApiProperty({ example: 'Vietnam', description: 'Quốc gia của khách hàng' })
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  country: string;

  @ApiProperty({ 
    example: 'John Contact', 
    description: 'Tên liên hệ của khách hàng', 
    required: false 
  })
  @IsOptional()
  contactName?: string;
}
