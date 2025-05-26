// src/migrations/CreateOrderTracking.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateOrderTracking1747210677101 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'order_tracking',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'OrderId',
                    type: 'int',
                    isNullable: false
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'finding_shipper', 'shipping', 'delivered', 'cancelled'],
                    isNullable: false
                },
                {
                    name: 'note',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'UpdatedById',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false
                },
                {
                    name: 'location',
                    type: 'jsonb',
                    isNullable: true
                }
            ]
        }), true);

        // Create foreign keys
        await queryRunner.createForeignKey('order_tracking', new TableForeignKey({
            columnNames: ['OrderId'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('order_tracking', new TableForeignKey({
            columnNames: ['UpdatedById'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL'
        }));
    }

public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_tracking');
    
    if (table) {
        // Tìm foreign keys nếu table tồn tại
        const foreignKeyOrderId = table.foreignKeys.find(fk => fk.columnNames.indexOf('OrderId') !== -1);
        const foreignKeyUpdatedBy = table.foreignKeys.find(fk => fk.columnNames.indexOf('UpdatedById') !== -1);
        
        // Chỉ xóa foreign key nếu chúng tồn tại
        if (foreignKeyOrderId) {
            await queryRunner.dropForeignKey('order_tracking', foreignKeyOrderId);
        }
        
        if (foreignKeyUpdatedBy) {
            await queryRunner.dropForeignKey('order_tracking', foreignKeyUpdatedBy);
        }
    }
    
    // Xóa bảng dù có foreign keys hay không
    await queryRunner.dropTable('order_tracking', true);
}
}