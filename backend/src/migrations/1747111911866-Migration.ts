import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747111911866 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO shippers ("id","Name", "shipper_code", "createdAt", "updatedAt")
            VALUES 
            (1,'Fast Delivery', 101, NOW(), NOW()),
            (2,'Express Logistics', 102, NOW(), NOW()),
            (3,'Global Transport', 103, NOW(), NOW()),
            (4,'Quick Ship', 104, NOW(), NOW()),
            (5,'Reliable Shipping', 105, NOW(), NOW())
            ON CONFLICT DO NOTHING
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
