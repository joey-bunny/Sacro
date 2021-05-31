import test from 'japa'
import { JSDOM } from 'jsdom'
isNaN,p
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.MYSQL_HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test('ensure home page works', async (assert, auth) => {
    const { text } = await supertest(BASE_URL).get('/').expect(200)
    const { document } = new JSDOM(text).window
    const title = document.querySelector('.title')

    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It Works!')
  })

  test('ensure user password gets hashed during save', async (assert) => {
    const user = new User()
    user.username = 'virk'
    user.email = 'virk@adonisjs.com'
    user.password = 'secret'
    await user.save()

    assert.notEqual(user.password, 'secret')
  })
})
