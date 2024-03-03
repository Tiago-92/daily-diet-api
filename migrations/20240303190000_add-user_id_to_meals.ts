import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meals', function (table) {
    table.uuid('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('meals', function (table) {
    table.dropColumn('user_id')
  })
}
