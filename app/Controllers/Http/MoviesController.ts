import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
//import Paystack from 'adonisjs-paystack'

export default class MoviesController {
  /**
  **ADD TO CART METHOD**
  **/
  public async getmovie ({ auth, request, response }: HttpContextContract) {
    await auth.authenticate()//Confirm logged in user
    const body = request.body()
    const searchParam = body.param
    const result = await axios.get(`http://www.omdbapi.com/?t=${searchParam}&apikey=${process.env.OMDB_API_KEY}`)//Send api request to OMDB
    //Required api response values
    const movieTitle = result.data.Title
    const moviePlot = result.data.Plot

    return response.json({
      title: movieTitle,
      plot: moviePlot,
    })
  }
}
