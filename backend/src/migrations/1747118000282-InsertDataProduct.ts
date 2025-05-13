import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertDataProduct1747118000282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO products ("Name", "UnitPrice", "createdAt", "updatedAt", "product_code", "quantity")
            VALUES 
            ('Apple iPhone 15 Pro Max', 1199.99, NOW(), NOW(), 1001, 45),
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
