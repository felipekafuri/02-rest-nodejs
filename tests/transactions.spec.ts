import { it, beforeAll, afterAll, beforeEach, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salário',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salário',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get('/transactions/' + transactionId)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Salário',
        amount: 1000,
        session_id: expect.any(String),
        created_at: expect.any(String),
      }),
    )

    expect(listTransactionsResponse.body.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: 'Salário',
          amount: 1000,
          session_id: expect.any(String),
          created_at: expect.any(String),
        }),
      ]),
    )
  })
})
