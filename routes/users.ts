import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../src/database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
    })

    const { name } = createUserSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })

    return reply.status(201).send()
  })
}
