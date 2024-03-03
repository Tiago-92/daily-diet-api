import fastify from 'fastify'
import cookie from '@fastify/cookie'
import mealsRoutes from '../routes/meals'
import usersRoutes from '../routes/users'
import metricsRoutes from '../routes/metrics'

export const app = fastify()
app.register(cookie)

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(metricsRoutes, {
  prefix: 'metrics',
})
