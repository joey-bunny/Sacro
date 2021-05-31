import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'
import Transaction from 'App/Models/Transaction'
import axios from 'axios'

export default class CartsController {
  /**
  **CHECK CART ITEMS METHOD**
  **/
  public async cart ({ auth, response }) {
    const user = await auth.authenticate()//Confirm logged in user
    const userId = user.id

    const items = await Cart.query().select('title', 'unitPrice').where('userId', userId)
    const itemCount = await Cart.query().where('userId', userId).count('title')
    const priceSum = await Cart.query().where('userId', userId).sum('price')

    return response.json({
      'itemCount': itemCount[0]['count(`title`)'],
      'totalPrice': priceSum[0]['sum(`price`)'],
      'sams': items[0]['title'],
      'items': items,
    })
  }

  /**
  **ADD TO CART METHOD**
  **/
  public async addItem ({ auth, request, response }: HttpContextContract) {
    const user = await auth.authenticate()
    const userId = user.id
    const email = user.email
    const search = request.input('search')

    const getMovie = await axios({
      method: 'post',
      url: `${process.env.MY_BASE_URL}/getmovie`,
      headers:{
        'Authorization': `${process.env.MY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        param: search,
      },
    })
    const title = getMovie.data.title
    const plot = getMovie.data.plot

    //Define movie price
    const price = 2000//Price in Kobo
    const nairaPrice = price * 0.01//Price in Naira

    if (title) {
      //check if item exist in cart
      const itemExist = await Cart
        .query()
        .where('userId', userId)
        .andWhere('title', title)
        .andWhere('plot', plot)

      const itemExistCount = await Cart
        .query()
        .where('userId', userId)
        .andWhere('title', title)
        .andWhere('plot', plot).count('title')
      const units = itemExistCount[0]['count(`title`)']

      if (units > 0) {
        const itemTitle = itemExist[0]['title']
        const itemPlot = itemExist[0]['plot']
        const itemAmount = itemExist[0]['amount']
        const itemUnitPrice = itemExist[0]['unitPrice']

        await Cart
          .query()
          .where('userId', user.id)
          .andWhere('title', title)
          .andWhere('plot', plot)
          .increment('amount', 1).increment('price', itemUnitPrice)

        return response.json({
          'title': itemTitle,
          'plot': itemPlot,
          'Amount': itemAmount + 1,
          'price': ((itemUnitPrice * itemAmount) + price) * 0.01,
        })
      }

      //If item does not exist in cart
      const cart = new Cart()
      cart.email = email
      cart.title = title
      cart.plot = plot
      cart.unitPrice = price
      cart.unitPrice = price
      await user?.related('carts').save(cart)

      //Return response
      return response.json({
        'stat': 'new',
        'Title': title,
        'Plot': plot,
        'Price': '#'+nairaPrice,
      })
    }

    return 'Requested movie unavailable'
  }

  /**
  **REMOVE FROM CART METHOD**
  **/
  public async removeItem ({ auth , request, response }: HttpContextContract) {
    const user = await auth.authenticate()//Confirm logged in user
    const userId = user.id
    const search =await request.input('search')

    const item = await Cart.findByOrFail('title', search)
    const itemName = item.title
    const itemUserId = item.userId
    const itemAmount = item.amount

    if (item) {
      if (userId === itemUserId) {
        if (itemAmount > 1) {
          const newItemAmount = itemAmount - 1
          item.amount = newItemAmount

          await item.save()

          return response.send(`1 ${itemName} removed from your cart, ${newItemAmount} remaining`)
        }

        await item.delete()
        return response.send(`${itemName} removed from your cart`)
      }

      return 'Unauthorized to delete'
    }

    return `${search} not found in your cart`
  }

  /**
  **CHECKOUT CART METHOD**
  **/
  public async checkout ({ auth, response}: HttpContextContract) {
    const user = await auth.authenticate()//Confirm logged in user
    const userId = user.id
    const email = user.email

    //GET CART 
    const getCart = await axios({
      method: 'get',
      url: `${process.env.MY_BASE_URL}/cart`,
      headers:{
        'Authorization': `${process.env.MY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    const cartItemCount = getCart.data.itemCount
    const cartPrice = getCart.data.totalPrice
    const cartItem = getCart.data.items

    //GET WALLET BALANCE
    const trans = await axios({
      method: 'get',
      url: `${process.env.MY_BASE_URL}/checkbalance`,
      headers:{
        'Authorization': `${process.env.MY_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    const walletBalance = trans.data

    //SAVE ALL FINANCIAL VALUES IN CONVERTED FORM (naira(#), negative(-))
    const ngnCartPrice = cartPrice * 0.01//(#)
    const ngnBalance = walletBalance * 0.01//(#)

    //CONFIRM CART CONTENT INFO
    if (cartItemCount > 0) {
      //CONFIRM FOR WALLET
      if (walletBalance >= cartPrice) {
        const transaction = await Transaction.create({
          email,
          amount: -cartPrice,
          type: 'purchase',
          status: 'success',
        })

        await user?.related('transactions').save(transaction)
        await Cart.query().where('userId', userId).delete()

        //Return response 
        return response.json({
          'Price': ngnCartPrice,
          'Status': 'Purchase successful',
          'Balance': ngnBalance - ngnCartPrice,
          'Amount of items': cartItemCount,
          'Items': cartItem,
        })
      }

      //Return response 
      return response.json({
        'balance': ngnBalance,
        'price': ngnCartPrice,
        'status': 'Purchase failed',
        'reason': 'Insufficient balance',
        'cart item count': cartItemCount,
        'items': cartItem,
      })
    }

    //Return response 
    return response.json({
      'cart status': 'Cart is empty',
    })
  }

  public async gets ({ auth, response }: HttpContextContract) {
    const user = await auth.authenticate()//Confirm logged in user
    const userId = user.id

    const items = await Cart.query().select('title', 'plot', 'price', 'amount').where('userId', userId)
    const cartContentAmount = await Cart.query().where('userId', userId).count('title')

    return response.json({
      'itemCount': cartContentAmount,
      'cartContentAmount': cartContentAmount[0]['count(`title`)'],
      'items': items,
    })
  }

  public async test ({}: HttpContextContract) {
    return `${process.env.MY_BASE_URL}`
  }
}
