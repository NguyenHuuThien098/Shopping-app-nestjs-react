import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAdminTable1747217217578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng admin
    await queryRunner.createTable(
      new Table({
        name: 'admin',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'UserId',
            type: 'int',
            isUnique: true, // Một admin chỉ liên kết với một user duy nhất
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    // Thêm khóa ngoại UserId liên kết với bảng users
    await queryRunner.createForeignKey(
      'admin',
      new TableForeignKey({
        columnNames: ['UserId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa bảng admin
    await queryRunner.dropTable('admin');
  }
}