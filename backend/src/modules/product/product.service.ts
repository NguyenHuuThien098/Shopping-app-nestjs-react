import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ILike } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(page: number, limit: number): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit, // Bỏ qua các sản phẩm trước đó
      take: limit, // Lấy số lượng sản phẩm tối đa
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async search(query: string, page: number, limit: number): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.productRepository.findAndCount({
      where: { Name: ILike(`%${query}%`) }, // Tìm kiếm theo tên sản phẩm
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
}