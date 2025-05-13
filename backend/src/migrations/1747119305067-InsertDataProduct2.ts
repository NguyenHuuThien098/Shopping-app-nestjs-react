import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertDataProduct21747119305067 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO products ("Name", "UnitPrice", "createdAt", "updatedAt", "product_code", "quantity")
            VALUES 
            ('Canon EOS R5', 3699.99, NOW(), NOW(), 1002, 12),
            ('Sony PlayStation 5 Pro', 599.99, NOW(), NOW(), 1003, 20),
            ('Samsung Galaxy Z Fold 5', 1799.99, NOW(), NOW(), 1004, 15),
            ('Apple Vision Pro', 3499.99, NOW(), NOW(), 1005, 8),
            ('Bose QuietComfort Ultra Headphones', 429.99, NOW(), NOW(), 1006, 30),
            ('ASUS ROG Zephyrus G14', 1899.99, NOW(), NOW(), 1007, 18),
            ('Dyson Airwrap Complete', 599.99, NOW(), NOW(), 1008, 25),
            ('LG C3 OLED 65" TV', 1999.99, NOW(), NOW(), 1009, 10),
            ('Sonos Arc Soundbar', 899.99, NOW(), NOW(), 1010, 22),
            ('Apple Watch Ultra 2', 799.99, NOW(), NOW(), 1011, 35),
            ('Microsoft Xbox Series X', 499.99, NOW(), NOW(), 1012, 28),
            ('Samsung Odyssey G9 Monitor', 1299.99, NOW(), NOW(), 1013, 15),
            ('DJI Mavic 3 Pro', 2199.99, NOW(), NOW(), 1014, 10),
            ('Garmin Fenix 7 Sapphire', 899.99, NOW(), NOW(), 1015, 20),
            ('Keychron Q1 Pro Keyboard', 199.99, NOW(), NOW(), 1016, 40),
            ('Oura Ring Gen 3', 349.99, NOW(), NOW(), 1017, 25),
            ('Remarkable 2 Tablet', 399.99, NOW(), NOW(), 1018, 30),
            ('Theragun Pro', 599.99, NOW(), NOW(), 1019, 15),
            ('Philips Hue Gradient Lightstrip', 229.99, NOW(), NOW(), 1020, 40)
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
