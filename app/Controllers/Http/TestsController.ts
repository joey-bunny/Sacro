import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestsController {
  public async test ({}: HttpContextContract) {
    return 'hello'
  }
}
