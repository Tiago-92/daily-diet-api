/* eslint-disable camelcase */
import { z } from 'zod'
import { knex } from '../src/database'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'

export default async function mealsRoutes(app: FastifyInstance) {
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

 /*  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where('id', id).first()

    return { meals }
  }) */

  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
      user_id: z.string(),
    })

    const { name, description, isDiet, user_id } = createMealsBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    const user = knex('users').where('user_id', user_id).first()

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 24 * 7, // 7 days
      })
    }

    if (!user) {
      return reply.status(404).send('Usuário não foi encontrado.')
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      isDiet,
      session_id: sessionId,
      user_id,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
      user_id: z.string(),
    })

    const idMealParamSchema = z.object({
      id: z.string(),
    })

    const { id } = idMealParamSchema.parse(request.params)
    const { name, description, isDiet, user_id } = getMealsParamsSchema.parse(
      request.body,
    )

    const meal = await knex('meals').where('id', id).first()

    if (!meal) {
      return reply.status(404).send('Refeição não foi encotrada!')
    }

    meal.name = name ?? meal.name
    meal.description = description ?? meal.description
    meal.isDiet = isDiet ?? meal.isDiet
    meal.user_id = user_id ?? meal.user_id

    await knex('meals').where({ id }).update(meal)

    return reply.status(204).send('Refeição atualizada com sucesso!')
  })

  app.delete('/:id', async (request, reply) => {
    const idParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = idParamsSchema.parse(request.params)

    await knex('meals').where({ id }).delete()

    return reply.status(201).send('Refeição exclúida!')
  })

  app.get('/:user_id', async (request) => {
    const userIdParamsSchema = z.object({
      user_id: z.string(),
    })

    const { user_id } = userIdParamsSchema.parse(request.params)

    const meal = await knex('meals').select().where('user_id', user_id)

    return { meal }
  })
}
