/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../src/database'

export default async function metricsRoutes(app: FastifyInstance) {
  app.get('/all-meal/:user_id', async (request) => {
    const userIdParamsSchema = z.object({
      user_id: z.string(),
    })

    const { user_id } = userIdParamsSchema.parse(request.params)

    const allMealsByUser = await knex('meals').count().where('user_id', user_id)

    return { allMealsByUser }
  })

  app.get('/diet-true/:user_id', async (request) => {
    const userIdParamsSchema = z.object({
      user_id: z.string(),
    })

    const { user_id } = userIdParamsSchema.parse(request.params)

    const allMealsWithinTheDiet = await knex('meals')
      .where('isDiet', true)
      .where('user_id', user_id)

    return { allMealsWithinTheDiet }
  })

  app.get('/diet-false/:user_id', async (request) => {
    const userIdParamsSchema = z.object({
      user_id: z.string(),
    })

    const { user_id } = userIdParamsSchema.parse(request.params)

    const allMealsOutsideTheDiet = await knex('meals')
      .where('isDiet', false)
      .where('user_id', user_id)

    return { allMealsOutsideTheDiet }
  })

  app.get('/best-diet-sequence/:user_id', async (request, reply) => {
    const userIdParamsSchema = z.object({
      user_id: z.string(),
    })

    try {
      const { user_id } = userIdParamsSchema.parse(request.params)

      const bestDietSequence = await knex('meals')
        .select(knex.raw("strftime('%Y-%m-%d', created_at) AS day"))
        .count('* as diet_meals_count')
        .where('isDiet', true)
        .where('user_id', user_id)
        .groupByRaw("strftime('%Y-%m-%d', created_at)")
        .orderBy('diet_meals_count', 'desc')

      return { bestDietSequence }
    } catch (error) {
      console.error('Erro ao buscar a melhor sequência de dieta:', error)
      reply.status(500).send('Erro interno do servidor')
    }
  })
}
