const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initilaizeDBAndServer = async () => {
  try {
    ;(db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })),
      app.listen(3000, () => {
        console.log(
          'Server running.... https://narendrakumar3sdyxnjscpdiitb.drops.nxtwave.tech/movies/',
        )
      })
  } catch (e) {
    console.log(`Error Msg: ${e.message}`)
    process.exit(1)
  }
}

initilaizeDBAndServer()

app.get('/movies/', async (request, response) => {
  const getMoviesNameQuary = `SELECT movie_name FROM movie`
  const dbResponse = await db.all(getMoviesNameQuary)
  const ans = each_player => {
    return {
      movieName: each_player.movie_name,
    }
  }
  response.send(dbResponse.map(each_player => ans(each_player)))
})

// POST new movielist

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addNewMovieQuary = `
  INSERT INTO
    movie(director_id, movie_name, lead_actor)
  VALUES 
    (${directorId},
   '${movieName}',
   '${leadActor}');`

  await db.run(addNewMovieQuary)
  response.send('Movie Successfully Added')
})

// GET spacific movie

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuary = `
  SELECT 
    * 
  FROM 
    movie 
  WHERE 
    movie_id = ${movieId}`
  const dbResponse = await db.get(getMovieQuary)

  const ans = resultObj => {
    return {
      movieId: resultObj.movie_id,
      directorId: resultObj.director_id,
      movieName: resultObj.movie_name,
      leadActor: resultObj.lead_actor,
    }
  }
  response.send(ans(dbResponse))
})

// PUT update movies table

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const requestBody = request.body
  const {directorId, movieName, leadActor} = requestBody

  const updateMovieDetailsQuary = `UPDATE 
    movie
  SET 
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
  WHERE
    movie_id = ${movieId}`

  await db.run(updateMovieDetailsQuary)
  response.send('Movie Details Updated')
})

// DELETE MOVIE

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params

  const deleteMovieQuary = `
  DELETE FROM 
    movie
  WHERE 
    movie_id = ${movieId}`

  await db.run(deleteMovieQuary)
  response.send('Movie Removed')
})

// GET directors

app.get('/directors/', async (request, response) => {
  const getDirectorQueary = `SELECT * FROM director`
  const dbResponse = await db.all(getDirectorQueary)

  const ans = eachDir => {
    return {
      directorId: eachDir.director_id,
      directorName: eachDir.director_name,
    }
  }

  response.send(dbResponse.map(eachDir => ans(eachDir)))
})

// GET movies directed by specific director

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getDirMoviesQuary = `
  SELECT 
    movie_name
  FROM
    movie 
  WHERE 
   director_id = ${directorId}
  `

  const dbResponse = await db.all(getDirMoviesQuary)
  const ans = eachResponse => {
    return {
      movieName: eachResponse.movie_name,
    }
  }

  response.send(dbResponse.map(eachResponse => ans(eachResponse)))
})

module.exports = app
