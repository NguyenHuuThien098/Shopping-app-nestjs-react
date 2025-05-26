// src/migrations/AddStatusToOrders.ts
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStatusToOrders1747210645108 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum type for status
        await queryRunner.query(`
            CREATE TYPE "order_status_enum" AS ENUM (
                'pending', 
                'finding_shipper', 
                'shipping', 
                'delivered', 
                'cancelled'
            )
        `);
        
        // Add status column
        await queryRunner.addColumn('orders', new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['pending', 'finding_shipper', 'shipping', 'delivered', 'cancelled'],
            default: "'pending'",
            isNullable: false
        }));
        
        // Add statusUpdatedAt column
        await queryRunner.addColumn('orders', new TableColumn({
            name: 'statusUpdatedAt',
            type: 'timestamp',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('orders', 'statusUpdatedAt');
        await queryRunner.dropColumn('orders', 'status');
        await queryRunner.query(`DROP TYPE "order_status_enum"`);
    }
}