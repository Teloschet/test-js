import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { app } from '../../api.js'

describe('#API E2E test Suite', () => {
  let BASE_URL = ''
  let _server = {}
  
  before(async () => {
    _server = app
    _server.listen()
    await new Promise((resolve, reject) => {
      _server.once('listening', () => {
        const { port } = _server.address()
        BASE_URL = `http://localhost:${port}`
        console.log('e2e rodando na ', BASE_URL)
        resolve()
      })
    })
  })

  after((done) => _server.close(done))

  describe('login', () => {
    it('should receive not authorize when user or password is invalid', async () => {
      const input = {
        user: 'invalid',
        password: ''
      }

      const result = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(input),
      })

      const expected = 401

      assert.strictEqual(
        result.status, 
        expected, 
        `status code should be 401, actul: ${result.status}`
      )

      const expectedBody = { error: 'user invalid!' }
      const response = await result.json()
      
      assert.deepStrictEqual(response, expectedBody, `response.body should be ${JSON.stringify(expectedBody)}, actual: ${JSON.stringify(response)}`)
    })
  })
})