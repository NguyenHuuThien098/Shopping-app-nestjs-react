import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1747116945833 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS products_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1
            `)

        await queryRunner.query(`
            ALTER TABLE products 
            ALTER COLUMN id SET DEFAULT nextval('products_id_seq')
            `)

        await queryRunner.query(`
            SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0) + 1)
            `)

        await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS shippers_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1
            `)

        await queryRunner.query(`
            ALTER TABLE shippers 
            ALTER COLUMN id SET DEFAULT nextval('shippers_id_seq')
            `)

        await queryRunner.query(`
            SELECT setval('shippers_id_seq', COALESCE((SELECT MAX(id) FROM shippers), 0) + 1)
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
