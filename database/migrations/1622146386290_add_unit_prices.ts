import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Carts extends BaseSchema {
  protected tableName = 'carts'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('unit_price')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('unit_price')
    })
  }
}
