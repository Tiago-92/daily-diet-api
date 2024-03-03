import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../src/database'

export default async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
    })
    const { name } = createUsersBodySchema.parse(request.body)

    await knex('users').insert({
      name,
    })

    return reply.status(201).send()
  })
}
