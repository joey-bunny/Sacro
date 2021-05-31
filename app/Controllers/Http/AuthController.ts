import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Account from 'App/Models/Account'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/AuthValidator'

export default class AuthController {
  public async register ({ request, auth }: HttpContextContract) {
    const validateData = await request.validate(AuthValidator)
    const users = await User.create(validateData)

    const token = await auth.use('api').login(users, {
      expiresIn: '10 days',
    })

    const account = new Account()
    account.email = users.email
    await account.save()

    return token.toJSON()
  }

  public async login ({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    })

    return token.toJSON()
  }
}
