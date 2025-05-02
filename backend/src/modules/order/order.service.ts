import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { OrderDetail } from '../../entities/order-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../../entities/product.entity';
import { Customer } from '../../entities/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderDetails } = createOrderDto;
  
    // Lấy thông tin Customer dựa trên userId
    const customer = await this.customerRepository.findOne({ where: { UserId: userId } });
    if (!customer) {
      throw new NotFoundException(`Customer not found for user ID ${userId}`);
    }
  
    // Kiểm tra sản phẩm có tồn tại và đủ số lượng không
    for (const detail of orderDetails) {
      const product = await this.productRepository.findOne({ where: { id: detail.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${detail.productId} not found`);
      }
  
      if (product.quantity < detail.quantity) {
        throw new NotFoundException(`Product with ID ${detail.productId} does not have enough stock`);
      }
  
      // Trừ số lượng sản phẩm trong kho
      product.quantity -= detail.quantity;
      await this.productRepository.save(product);
    }
  
    // Tính tổng tiền
    const totalAmount = orderDetails.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);
  
    // Tạo đơn hàng
    const order = this.orderRepository.create({
      CustomerId: customer.id,
      OrderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    // Lưu đơn hàng vào database
    const savedOrder = await this.orderRepository.save(order);
  
    // Tạo chi tiết đơn hàng
    const orderDetailsEntities = orderDetails.map(detail =>
      this.orderDetailRepository.create({
        OrderId: savedOrder.id,
        ProductId: detail.productId,
        Quantity: detail.quantity,
        Price: detail.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  
    // Lưu chi tiết đơn hàng vào database
    await this.orderDetailRepository.save(orderDetailsEntities);
  
    // Trả về đơn hàng đã tạo
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['orderDetails'],
    });
  
    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!completeOrder) {
      throw new NotFoundException(`Order with ID ${savedOrder.id} not found`);
    }
  
    return completeOrder;
  }
}