import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Criar uma nova tabela 'temp_users' com a estrutura desejada
  await knex.schema.createTable('temp_users', function (table) {
    table.increments('id').primary()
    table.text('name').notNullable()
  })

  // Copiar os dados da tabela 'users' para 'temp_users'
  await knex.raw('INSERT INTO temp_users (name) SELECT name FROM users')

  // Deletar a tabela antiga 'users'
  await knex.schema.dropTableIfExists('users')

  // Renomear a nova tabela 'temp_users' para 'users'
  await knex.schema.renameTable('temp_users', 'users')
}

export async function down(knex: Knex): Promise<void> {
  // Desfazer as alterações feitas na função up
  await knex.schema.dropTableIfExists('users')

  await knex.schema.createTable('users', function (table) {
    table.uuid('id').primary()
    table.text('name').notNullable()
  })

  await knex.raw('INSERT INTO users (name) SELECT name FROM temp_users')

  await knex.schema.dropTableIfExists('temp_users')
}
