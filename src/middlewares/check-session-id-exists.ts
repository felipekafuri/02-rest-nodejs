import { FastifyRequest, FastifyReply } from 'fastify'

export function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send()
  }
  done()
}
