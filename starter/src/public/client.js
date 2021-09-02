// let store = {
//     user: { name: "something" },
//     apod: '',
//     rovers: ['Curiosity', 'Opportunity', 'Spirit'],
//     selectedRover: 'NAN',
//     roversData: '',
// }

let store = {
    selectedRover: '',
    selectedCamera: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    roverData: '',
    }

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
    const roverListItemElements = document.querySelectorAll("[datarovername]");
    roverListItemElements.forEach(function (roverName) {
        roverName.addEventListener('click', clickedRover);
    });

    const roverCameraButtons = document.querySelectorAll("[datacameraname]");
    roverCameraButtons.forEach(function (roverName) {
        roverName.addEventListener('click', clickedCamera);
    });
}

const clickedRover = (evt) => {
    // const roverDetails = document.getElementById('roverDetails')
    const roverName = evt.target.getAttribute('datarovername')
    updateStore({"selectedRover": roverName})
    updateStore({"selectedCamera": ''})
    return roverName
}

const clickedCamera = (evt) => {
    const cameraName = evt.target.getAttribute('datacameraname')
    const cameraImg = evt.target.getAttribute('dataimg')
    updateStore({"selectedCamera": {name: cameraName, img: cameraImg}})
    console.log(store.selectedCamera)
    console.log(store)
    return cameraName
}


// create content
const App = (state) => {
    let { roverData } = state
    RoverData(roverData)

    return `
        <div class="wrapper">
        <header class="header">ROVER DASHBOARD</header>
        ${SideBar(store['rovers'], ListRovers)}
        <main class="content">
            <section class="rover-display">
                <div class="rover-display__inner">
                    <div id="roverDetails" class="rover-details">
                        ${Greeting(store['selectedRover'])}
                        <div class="content__rover-details">
                            ${RoverInfo(store)}
                        </div>
                    </div>
                    <div class="rover-images">
                        ${RoverImages(store, buildImage)}
                    </div>
                </div>
            </section>
        <section class="rover-camera-buttons">
            ${CameraButtons(store, findSelectedRover, buildButtons)}
        </section>
        </main>
        <footer class="footer">2021</footer>
        </div>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Rubric requires us to create at least two High Order Functions which should correspond to re-usable UI components

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h2>${name}</h2>
        `
    }
    return `
        <h2>Waiting for selection...</h2>
    `
}

// Pure function
const ListRovers = function (roverName) {

    if (store.selectedRover === roverName) {

        return `
            <div class="rover-list__radio-btn-wrapper">
                <input type="radio" name="roverNames" id="${roverName}target" class="rover-list__radio-btn" datarovername="${roverName}">
                <label class="rover-list__label--clicked" for="${roverName}target">${roverName}</label>
            </div>
        `
    } else {
       return `
        <div class="rover-list__radio-btn-wrapper">
            <input type="radio" name="roverNames" id="${roverName}target" class="rover-list__radio-btn" datarovername="${roverName}">
            <label class="rover-list__label" for="${roverName}target">${roverName}</label>
        </div>
    `
    }
}

// Higher Order Function 1
const SideBar = (rovers, ListRovers) => {
    const listItems = rovers.map(ListRovers).join("")
    return `
        <aside class="sidebar">
            <div class="rover-btn-group">${listItems}</div>
        </aside>
    `
}


const findSelectedRover = function (store) {
    const rover = store.roverData.filter(obj => {
        return obj.rover_name === store.selectedRover
    })
    return rover[0]
}

// pure function
const buildImage = function (entry) {
    return`
        <figure class="img_grid__figure">
            <img class="img_grid__img" src="${entry['img']}">
            <figcaption class="img_grid__caption">CAMERA: ${entry['name']}</figcaption>
        </figure>
    `
}

// Higher Order Function 2
const RoverImages = (store, buildImages) => {
    const selectedCamera = store.selectedCamera
    if (selectedCamera) {
        const builtImage = buildImage(selectedCamera)
        return `<div class="img_grid">${builtImage}</div>`
    } else {
        return `<div class=""></div>`
    }
}

const buildButtons = function (entry) {
    return`
        <button class="btn-primary" dataCameraName="${entry['camera_name']}" dataimg="${entry['img_src']}">${entry['camera_name']}</button>
    `
}

const CameraButtons = (store, findSelectedRover) => {
    const rover = findSelectedRover(store)

    if (rover != undefined) {
        const roverImages = rover['rover_images']

        if (store.selectedCamera == ''){

        }

        const builtbuttons = roverImages.map(buildButtons).join("")
        return `<div class="btn-grid">${builtbuttons}</div>`
    } else {
        return `<div class=""></div>`
    }

}

const RoverInfo = (store) => {
    const rover = findSelectedRover(store)
    if (rover != undefined) {
        const roverInfo = rover['rover_info']
        console.log("roverInfo : ", roverInfo)
        return`
                <p>launch date : ${roverInfo['launch_date']}</p>
                <p>landing date : ${roverInfo['landing_date']}</p>
                <p>status : ${roverInfo['status']}</p>
                <p>photo date: ${roverInfo['photo_date']}</p>
            `
    } else {
        return `
            <div class="">
                <p></p>
            </div>
            `
    }
}

const RoverData = (roversData) => {
    if (roversData === "" ) {
        // get the name of the specified rover via the roversData obj
        getRoverData(roversData)
    } else {
        console.log("RoverData not empty")
    }
}


// ------------------------------------------------------  API CALLS
const getRoverData = (state) => {

    let { selectedRover } = state
    console.log('GetRoverData start log state: ', state)

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(roverData => updateStore({roverData}))
    return roverData
}