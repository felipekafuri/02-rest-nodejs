import { env } from './env'

import { app } from './app'

app
  .listen({
    port: env.PORT,
  })
  .then((address) => {
    console.log(`Server is listening on ${address}`)
  })
