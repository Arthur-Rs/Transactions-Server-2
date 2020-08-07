import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AddColumnCategoryInTransactions1595988099587
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const newForeignKey = new TableForeignKey({
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      name: 'transactions_categories',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryRunner.createForeignKey('transactions', newForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'transactions_categories');
  }
}
