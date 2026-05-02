import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('title')
      table.string('cover')
      table.string('content')
      table.jsonb('raw_content')
      table.string('directory_id')
        .references('id')
        .inTable('directories')
        .onDelete('CASCADE')
      table.string('owner_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('position_idx').notNullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
