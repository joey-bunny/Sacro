import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class ItemSeeder extends BaseSeeder {
  public async run () {
    await Cart.createMany([
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
      {
        userId: 2,
        email: 'joey@sacro.com',
        title: 'Frank',
        plot: 'lenum ipsum',
        price: 2000,
      },
    ])
  }
}
