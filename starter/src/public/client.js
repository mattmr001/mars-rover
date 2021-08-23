// let store = {
//     user: { name: "something" },
//     apod: '',
//     rovers: ['Curiosity', 'Opportunity', 'Spirit'],
//     currentRover: 'NAN',
//     roversData: '',
// }

let store = Immutable.Map({
    user: Immutable.Map({name: "Matt"}),
    apod: '',
    currentRover: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    roversData: ''
    })

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)

    const roverListItemElements = document.querySelectorAll("[datarovername]");
    roverListItemElements.forEach(function (roverName) {
        roverName.addEventListener('click', ShowRovers);
    });

}

const ShowRovers = (evt) => {
    // debug
    let { currentRover } = evt.target.getAttribute('datarovername')

    console.log('Starting currentRover: ', store.currentRover)
    console.log("ShowRovers target: ", evt.target.getAttribute('datarovername'))
    console.log('store currentRover: ', currentRover)
    updateStore(store.currentRover, { currentRover })
    console.log(store)
}


// create content
const App = (state) => {
    let { roversData } = state
    RoverData(roversData)

    return `
        <div class="wrapper">
        <header class="header">NASA ROVERS</header>

        ${SideBar(store.rovers)}

        <main class="content">
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                ${ShowRovers}
            </section>
        </main>
        <footer>Stuff</footer>
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
            <h1>Rover Name: ${name}</h1>
        `
    }
    return `
        <h1>Hello!</h1>
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
            <li datarovername="${roverName}">${roverName}</li>
        `
    }).join("")
    return `
        <aside class="sidebar">
            <h2>SIDEBAR</h2>
            <ul>${roverList}</ul>
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

// const RoverImages = (rovers) => {
//     const roverImages = rovers[0]['rover_images']
//     const builtImages = roverImages.map(entry => {
//         return`
//             <figure class="img_grid__figure">
//                 <img class="img_grid__img" src="${entry['img_src']}">
//                 <figcaption class="img_grid__caption">CAMERA: ${entry['camera_name']}</figcaption>
//             </figure>
//         `
//     }).join("")
//     return `<div class="img_grid">${builtImages}</div>`
// }

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

    let { roversData } = state
    console.log('GetRoverData start log state: ', state)

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(roversData => updateStore(store, { roversData } ))
    return data
}