const express = require('express')
const app = express()

const port = 3000
require('dotenv').config()

/* Dependencies */
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')
const querystring = require("querystring");
const {Map, List} = require('immutable');

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
const globals = Map({
    rover_list: List(['Curiosity', 'Opportunity', 'Spirit']),
    camera_list: List(['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM', 'PANCAM', 'MINITES']),
});

// const cameraList = ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM', 'PANCAM', 'MINITES']

// :::::::::::::::::::::::::::::::::::::::::::

/*
 * Get data pertaining to the latest photos from a specified NASA rover
 */
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
    const roverInformation = roverData.reduce((accumulator, current, index) => {
        const keyInfo = {
            launch_date: current['rover']['launch_date'],
            landing_date: current['rover']['landing_date'],
            status: current['rover']['status'],
            photo_date: current['earth_date'],
        }
        // Get the first entry in our data and push it to our accumulator
        if (index === 0) {
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

/*
 * Build an object containing the newest images and details from an individual rover.
 */
const buildRoverObject = (apiData, cameraList, roverName) => {
        const roverInfo = buildRoverInformation(apiData)
        const imageCollection = buildImageCollection(apiData, cameraList)

        const roverinformation = {
            rover_name: roverName,
            rover_info: roverInfo[0],
            rover_images: imageCollection,
        }
    return roverinformation
}

/*
 * Build an object containing data for every rover.
 */
async function buildAllRovers (globalsObj) {
    const roverList = globalsObj.get('rover_list')
    const allRoverData = await Promise.all(roverList.toJS().map( async x => {
        try {
            const apiData = await getRoverApiData(x)
            const cameraList = (globalsObj.get('camera_list'))
            const roverObject = buildRoverObject(apiData, cameraList, x)
            return roverObject

        } catch (error) {
            console.log(error)
        }
    }))
    return allRoverData
}


async function debug () {
    try {
        console.log('DEBUG START: ');
        // console.log(roversMap.get('rover_list').get(1))

        // const roverName = globals.get('rover_list').get(1)
        // const apiData = await getRoverApiData(globals.get(roverName))
        // DEBUG apiData:
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

        // DEBUG buildRoverObject:
        // const roverName = globals.get('rover_list').get(1)
        // console.log('NAME!!!:', roverName)
        // const apiData = await getRoverApiData(roverName)
        // const cameraList = (globals.get('camera_list'))
        // const data = buildRoverObject(apiData, cameraList, roverName)
        // return data

        // DEBUG allRoverData:
        // const data = buildAllRovers(globals)
        // return data


    } catch (error) {
        console.log(error)
    }
}

debug().then(data => {
    console.log('DEBUG OUTPUT: ');
    console.log(data);
    console.log('DEBUG END')
});


app.get('/rovers', async (req, res) => {
      try {
        const data = await buildAllRovers(globals)
        res.json(data)
      } catch (error) {
        console.log(error)
  }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))