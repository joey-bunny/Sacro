import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import axios from 'axios'

export default class PaymentsController {
  //Payment initialize method
  public async depositInit ({ auth, request, response }: HttpContextContract){
    const user = await auth.authenticate()//Authenticate currently logged in user
    const email = user.email
    const amount = request.input('amount')
    const KoboAmount = amount * 100

    //Make api request to initialize payment
    const trans = await axios({
      method: 'post',
      url: 'https://api.paystack.co/transaction/initialize',
      headers:{
        'Authorization': `${process.env.PAYSTACK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        'email': email,
        'amount': KoboAmount,
        'callback_url': `${process.env.MY_NGROK_TUNNEL}/api/depositcallback`,
      },
    })

    //Required api response values
    const reference = trans.data.data.reference
    const status = trans.data.status
    const message = trans.data.message
    const authorizationUrl = trans.data.data.authorization_url
    const accessCode = trans.data.data.access_code

    //Enter transaction into Transactions table
    const transaction = new Transaction()
    transaction.email = email
    transaction.amount = KoboAmount
    transaction.reference = reference
    transaction.status = 'pending'
    transaction.type = 'payment',
    await user?.related('transactions').save(transaction)

    //Return response
    return response.json({
      'status': status,
      'message': message,
      'Authorization Url': authorizationUrl,
      'Access Code': accessCode,
      'Reference': reference,
    })
  }

  /**
  **DEPOSIT INITIALIZE CALLBACK RECIEVER METHOD**
  **/
  public async depositInitCallback ({ response, request }: HttpContextContract) {
    const url = request.all()//Get page url
    const ref = await url.reference//Get reference from page url

    //Make api request to verify initialized payment
    const check = await axios({
      method: 'get',
      url: `https://api.paystack.co/transaction/verify/${ref}`,
      headers:{
        'Authorization': `${process.env.PAYSTACK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    //Required api response values
    const transStatus = check.data.data.status//Payment status
    const transAmount = check.data.data.amount//Kobo value of amount
    const ngnTransAmount = transAmount * 0.01//Naira value of amount
    const transEmail = check.data.data.customer.email//Customer email from paystack

    //Database request
    const currentTransaction = await Transaction.findByOrFail('reference', ref)//Request transaction row using reference

    const localTransStat = currentTransaction.status//Request transaction row using reference code as filter

    //Confirm if transaction status is pending
    if (localTransStat === 'pending') {
      //Change Transaction status and save
      currentTransaction.status = transStatus//change local status to status response from paystack
      await currentTransaction.save()

      //Return a response
      return response.json({
        'Status': transStatus,
        'Amount': ngnTransAmount,
        'Email': transEmail,
      })
    }

    //Return response if transaction status is not pending
    return response.json({
      'status': transStatus,
      'amount': transAmount,
      'email': transEmail,
      'payment time': check.data.data.paidAt,
    })
  }

  /**
  **PAYMENT VARIFICATION METHOD**
  **/
  public async verifypayment ({ auth, request, response }: HttpContextContract) {
    const user = await auth.authenticate()//Authenticate currently logged in user
    const email = user.email//Logged in user email
    const reference = request.input('reference')
    const check = await axios({
      method: 'get',
      url: `https://api.paystack.co/transaction/verify/${reference}`,
      headers:{
        'Authorization': `${process.env.PAYSTACK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    //Required api response values
    const transactionEmail = check.data.data.customer.email

    //Confirm user authorization status
    if (email !== transactionEmail) {
      return 'Unauthorized to check this transaction'
    }

    //Required api response values
    const status = check.data.data.status//Payment status
    const id = check.data.data.id//Payment Id
    const amount = check.data.data.amount//Payment Amount
    const nairaAmount = amount * 0.01//Payment Amount
    const paidAt = check.data.data.paid_at//Payment time

    return response.json({
      'status': status,
      'id': id,
      'amount': '#'+ nairaAmount,
      'Paid at': paidAt,
    })
  }
}
