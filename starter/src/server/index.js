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

// Globals
const cameraList = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM', 'PANCAM', 'MINITES']

// :::::::::::::::::::::::::::::::::::::::::::
async function getRoverApiData (roverName) {
  try {
    const protocol = 'https'
    const nasaUrl = 'api.nasa.gov/mars-photos/api/v1/rovers'

    const params = {
      api_key: `${process.env.API_KEY}`
    }

    const options = {
      method: 'GET'
    }

    const apiQuery = `${protocol}://${nasaUrl}/${roverName}/latest_photos?${querystring.stringify(params)}`
    // // DEBUG:
    console.log('Api query', apiQuery)
    const result = await fetch(apiQuery, options)
    const resultJson = await result.json()
    return resultJson
  } catch (error) {
    throw (error)
  }
}

const buildCameraImages = (apiData, cameraName) => {
    const roverData = Object.values(apiData).flat()
    // // DEBUG:
    // console.log(roverData)
    const camera = roverData.filter((rover, index, arr) => rover['camera']['name'] === cameraName)
    const cameraData = camera.map(data => {
        return {
            rover: data['rover']['name'],
            camera_name: data['camera']['name'],
            img_src: data['img_src']
        }
    })
    return cameraData
}

const buildImageCollection = (apiData, cameraList) => {
    const imgData = cameraList.reduce((result, cameraName) => {
        const builtImages = buildCameraImages(apiData, cameraName)

        if (builtImages != 0){
           // Push the latest image from each camera
           result.push(builtImages[0])
        }
        return result
    }, [])
    return imgData
}

async function debug () {
    try {
        const apiData = await getRoverApiData('curiosity')
        // DEBUG:
        // console.log('apiData : ', apiData)
        // const roverImages = buildImages(apiData, 'FHAZ')
        const imageCollection = buildImageCollection(apiData, cameraList)
        // DEBUG:
        // console.log('roverImages : ', roverImages)
        return imageCollection

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