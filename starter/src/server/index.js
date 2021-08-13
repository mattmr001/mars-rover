const express = require('express')
const app = express()

const port = 3000
require('dotenv').config()

/* Dependencies */
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const querystring = require("querystring");

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
// app.get('/apod', async (req, res) => {
//     try {
//         let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         res.send({ image })
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

// app.get('/rovers', async (req, res) => {
//     try {
//
//         let roverData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/?api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         res.send({ roverData })
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

// :::::::::::::::::::::::::::::::::::::::::::
async function getRoverApiData (rovername) {
  try {
    const protocol = 'https'
    const nasaUrl = 'api.nasa.gov/mars-photos/api/v1/rovers'

    const params = {
      api_key: `${process.env.API_KEY}`
    }

    const options = {
      method: 'GET'
    }

    const apiQuery = `${protocol}://${nasaUrl}/${rovername}/?${querystring.stringify(params)}`
    // DEBUG:
    console.log('Api query', apiQuery)
    const result = await fetch(apiQuery, options)
    const resultJson = await result.json()
    return resultJson
  } catch (error) {
    throw (error)
  }
}

const buildImages = (apiData) => {

    const roverImages = apiData

    return roverImages

}

async function debug () {
    try {
        const apiData = await getRoverApiData('curiosity')
        // DEBUG:
        // console.log('apiData : ', apiData)
        const roverImages = buildImages(apiData)
        // DEBUG:
        // console.log('roverImages : ', roverImages)
        return roverImages

    } catch (error) {
        console.log(error)
    }
}

debug().then(data => {
    console.log(data);
});

app.get('/rovers', async (req, res) => {
      try {
          const roverData = await getRoverApiData('curiosity')
          console.log('Data output: ', roverData)
          res.json(roverData)
      } catch (error) {
        console.log(error)
  }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))