// let store = {
//     user: { name: "something" },
//     apod: '',
//     rovers: ['Curiosity', 'Opportunity', 'Spirit'],
//     selectedRover: 'NAN',
//     roversData: '',
// }

let store = {
    selectedRover: '',
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
        roverName.addEventListener('click', selectedRover);
    });

}

const selectedRover = (evt) => {

    // const roverDetails = document.getElementById('roverDetails')
    const roverName = evt.target.getAttribute('datarovername')
    updateStore({"selectedRover": roverName})
    console.log('New store: ', store)
    console.log('selectedRover output: ', roverName)
    return roverName
}

// const ShowRover = (selectedRover) => {
//     // debug
//     // console.log('Starting selectedRover: ', store.get(selectedRover))
//     const roverDetails = document.getElementById('roverDetails')
//     const roverName = evt.target.getAttribute('datarovername')
//     // console.log('store selectedRover: ', selectedRover)
//     updateStore({"selectedRover": roverName})
//     const images = RoverImages(store['roverData'], roverName)
//
//     roverDetails.innerHTML = images
//     console.log(roverDetails)
// }


// create content
const App = (state) => {
    let { roverData } = state
    RoverData(roverData)

    return `
        <div class="wrapper">
        <header class="header">NASA ROVERS</header>

        ${SideBar(store['rovers'])}

        <main class="content">
            ${Greeting(store['selectedRover'])}
            <section id="roverDetails" class="content__rover-details">
                <h3>Data to be placed</h3>
                <p>Data not yet placed</p>
                ${RoverImages(store)}
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h2>Rover Name: ${name}</h2>
        `
    }
    return `
        <h2>Select rover from menu</h2>
    `
}

// const ListRovers = (rovers) => {
//     const roverList = rovers.map(x => {
//         const rover = x['rover_name']
//         return `
//             <li datarovername="${rover}">${rover}</li>
//         `
//     }).join("")
//     return `
//         <ul>${roverList}</ul>
//     `
// }

const SideBar = (rovers) => {
    const roverList = rovers.map(roverName => {
        return `
            <li class="rover-list__item" datarovername="${roverName}">${roverName}</li>
        `
    }).join("")
    return `
        <aside class="sidebar">
            <h2>ROVERS</h2>
            <ul class="rover-list">${roverList}</ul>
        </aside>
    `
}

// const ShowRovers = () => {
//     const roverListItemElements = document.querySelectorAll("[datarovername]");
//     console.log('roverListItemElements : ',roverListItemElements)
//     // const elements = roverListItemElements.forEach(el =>{
//     //     console.log(el)
//     //     el.addEventListener(('click', (e) => {
//     //         console.log('clicked')
//     //     }))
//     // })
//     return roverListItemElements
// }

const RoverImages = (store) => {


    const rover = store.roverData.filter(obj => {
        return obj.rover_name === store.selectedRover
    })
    console.log('New store: ', store)
    console.log('selectedRover output: ', store.selectedRover)
    console.log('selected rover: ', rover)

    // return rover
    // console.log('RoverImages roverData:', store.roverData)
    // console.log('RoverImages selectedRover:', store.selectedRover)
    // const rover = store.roverData.filter(obj => {
    //     console.log('RoverImages obj:', obj)
    //     console.log('RoverImages rover_name:', obj.rover_name)
    //     return obj.rover_name === selectedRover
    // })

    if (rover[0] != undefined) {
        const roverImages = rover[0]['rover_images']
        const builtImages = roverImages.map(entry => {
            return`
                <figure class="img_grid__figure">
                    <img class="img_grid__img" src="${entry['img_src']}">
                    <figcaption class="img_grid__caption">CAMERA: ${entry['camera_name']}</figcaption>
                </figure>
            `
        }).join("")
        return `<div class="img_grid">${builtImages}</div>`
    } else {
        return `<div class="img_grid">failed to retrieve images</div>`
    }


    // const builtImages = roverImages.map(entry => {
    //     return`
    //         <figure class="img_grid__figure">
    //             <img class="img_grid__img" src="${entry['img_src']}">
    //             <figcaption class="img_grid__caption">CAMERA: ${entry['camera_name']}</figcaption>
    //         </figure>
    //     `
    // }).join("")
    // return `<div class="img_grid">${builtImages}</div>`
}

const RoverInfo = (rovers) => {
    const launchDate = rovers[0]['rover_info']['earth_date']
    const landingDate = rovers[0]['rover_info']['earth_date']
    const status = rovers[0]['rover_info']['status']
    const photoDate = rovers[0]['rover_info']['photo_date']

        return`
            <pre>${roverInfo}</pre>
        `
}

const RoverData = (roversData) => {
    console.log("Rovers data start: ", roversData)
    if (roversData === "" ) {
        // console.log("RoverData is empty")
        // console.log('In condtion : ', roversData)

        // get the name of the specified rover via the roversData obj
        getRoverData(roversData)
        // getRoverData(store)
        console.log('In condtion end : ', roversData)
    } else {
        console.log("RoverData not empty")
    }
}


// ------------------------------------------------------  API CALLS

// Example API call
// const getImageOfTheDay = (state) => {
//     let { apod } = state
//
//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, { apod }))
//
//     return data
// }

const getRoverData = (state) => {

    let { selectedRover } = state
    console.log('GetRoverData start log state: ', state)

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(roverData => updateStore({roverData}))
    return roverData
}