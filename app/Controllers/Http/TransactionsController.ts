import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'

export default class TransactionsController {
  /**
  **CHECK USER WALLET BALANCE**
  **/
  public async accountBalance ({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id

    //SUM ALL TRANSACTIONS
    const transact = await Transaction.query().where({'userId': userId, 'status': 'success'}).sum('amount')
    const balance = transact[0]['sum(`amount`)']
    return balance
  }

  /**
  **VIEW TRANSACTION HISTORY**
  **/
  public async transactions ({ auth }) {
    const user = await auth.authenticate()
    const userId = user.id

    const transactions = await Transaction
      .query()
      .select('type', 'amount')
      .where({'userId': userId, 'status': 'success'})

    return transactions
  }
}
