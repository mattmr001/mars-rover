const express = require('express')
const app = express()

const port = 3000
require('dotenv').config()

/* Dependencies */
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const querystring = require("querystring");
const Immutable = require('immutable');

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

/*
 * The build a collection of objects containing relevant info for a rover.
 */
const buildRoverInformation = (apiData) => {
    const roverData = Object.values(apiData).flat()
    // // DEBUG:
    // console.log(roverData)
    const roverInformation = roverData.reduce((accumulator, current, index) => {
        const keyInfo = {
            name: current['rover']['name'],
            landing_date: current['rover']['landing_date'],
            launch_date: current['rover']['launch_date'],
            earth_date: current['earth_date']
        }
        // Get the first item and push it to our accumulator
        if (index === 1) {
            accumulator.push(keyInfo)
        }
        return accumulator
    }, [])
    return roverInformation
}

/*
 * The build a collection of objects containing images taken by a specific camera and its name.
 */
const buildCameraImages = (apiData, cameraName) => {
    const roverData = Object.values(apiData).flat()
    // // DEBUG:
    // console.log(roverData)
    const camera = roverData.filter((rover, index, arr) => rover['camera']['name'] === cameraName)
    const cameraData = camera.map(data => {
        return {
            camera_name: data['camera']['name'],
            img_src: data['img_src']
        }
    })
    return cameraData
}

/* The rover has a series of cameras.
 * Grab the latest image from each camera and place it in a collection.
 * @summary Build a collection of images taken by each camera.
 */
const buildImageCollection = (apiData, cameraList) => {
    const imgCollection = cameraList.reduce((accumulator, cameraName) => {
        const cameraImages = buildCameraImages(apiData, cameraName)
        // check to see if images exist for that camera
        if (cameraImages != 0){
           // Push the latest image from camera.
           accumulator.push(cameraImages[0])
        }
        return accumulator
    }, [])
    return imgCollection
}

const buildRoverData = (apiData, cameraList) => {
        const roverInfo = buildRoverInformation(apiData)
        const imageCollection = buildImageCollection(apiData, cameraList)

        const roverinformation = {
            rover_info: roverInfo[0],
            rover_images: imageCollection,
        }
    return roverinformation
}

async function debug () {
    try {
        const apiData = await getRoverApiData('curiosity')
        // // DEBUG apiData:
        // console.log('apiData : ', apiData)
        // return apiData

        // // DEBUG roverDetails:
        // const roverDetails = buildRoverInformation(apiData)
        // console.log('RoverInformation : ', apiData)
        // return roverDetails

        // // DEBUG roverImages:
        // const roverImages = buildCameraImages(apiData, 'FHAZ')
        // console.log('roverImages : ', roverImages)
        // return roverImages

        // // DEBUG collectionImages:
        // const imageCollection = buildImageCollection(apiData, cameraList)
        // console.log('ImageCollection : ', imageCollection)
        // return imageCollection

        // DEBUG roverData:
        const data = buildRoverData(apiData, cameraList)
        return data


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