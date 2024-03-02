import { z } from 'zod'
import { knex } from '../src/database'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send({
        error: 'Unauthorizied',
      })
    }

    const meals = await knex('meals').select()

    return { meals }
  })

  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where('id', id).first()

    return { meals }
  })

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, isDiet } = createMealsBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 24 * 7, // 7 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      isDiet,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
