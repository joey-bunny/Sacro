/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TestsController.test')
  Route.group(() => {
    Route.post('register', 'AuthController.register')//Registration route
    Route.post('login', 'AuthController.login')//Login route
  })

  Route.group(() => {
    Route.post('deposit', 'PaymentsController.depositInit')//Wallet deposit route
    Route.get('depositcallback', 'PaymentsController.depositInitCallback')//Wallet deposit callback route
    Route.post('verifypayment', 'PaymentsController.verifypayment')//Wallet deposit verification route
  })

  Route.group(() => {
    Route.post('getmovie', 'MoviesController.getmovie')//Get movie route
  })

  Route.group(() => {
    Route.get('checkbalance', 'TransactionsController.accountBalance')//Check account balance route
    Route.get('transactions', 'TransactionsController.transactions')//Get transaction history route
  })

  Route.group(() => {
    Route.get('cart', 'CartsController.cart')//View cart Content route
    Route.post('additem', 'CartsController.addItem')//Add item to cart route
    Route.post('removeitem', 'CartsController.removeItem')//Remove item from cart route
    Route.get('checkout', 'CartsController.checkout')//Checkout cart route
    Route.get('gets', 'CartsController.gets')
    Route.get('test', 'CartsController.test')
  })
}).prefix('api')
