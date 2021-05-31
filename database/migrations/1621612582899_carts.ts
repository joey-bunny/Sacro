import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Carts extends BaseSchema {
  protected tableName = 'carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
      table.string('email')
      table.string('title')
      table.string('plot')
      table.integer('price')
      table.integer('amount').defaultTo(1)
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
