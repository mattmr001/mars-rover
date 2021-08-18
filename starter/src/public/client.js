let store = {
    user: { name: "something" },
    apod: '',
    rovers: '',
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state
    RoverData(store.rovers)

    return `
        <div class="wrapper">
        <header class="header">NASA ROVERS</header>
        <aside class="sidebar">
        <h2>SIDEBAR</h2>
        ${ListRovers(store.rovers)}
        </aside>
        <main class="content">
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                ${RoverImages(store.rovers)}
                ${ShowRovers()}
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

const ListRovers = (rovers) => {
    const roverList = rovers.map(x => {
        const rover = x['rover_name']
        return `
            <li datarovername="${rover}">${rover}</li>
        `
    }).join("")
    return `
        <ul>${roverList}</ul>
    `
}

const ShowRovers = () => {
    const roverListItemElements = document.querySelectorAll("[datarovername]");
    console.log('roverListItemElements : ',roverListItemElements)
    // const elements = roverListItemElements.forEach(el =>{
    //     console.log(el)
    //     el.addEventListener(('click', (e) => {
    //         console.log('clicked')
    //     }))
    // })
    return roverListItemElements
}

const RoverImages = (rovers) => {
    const roverImages = rovers[0]['rover_images']
    const builtImages = roverImages.map(entry => {
        return`
            <figure class="img_grid__figure">
                <img class="img_grid__img" src="${entry['img_src']}">
                <figcaption class="img_grid__caption">CAMERA: ${entry['camera_name']}</figcaption>
            </figure>
        `
    }).join("")
    return `<div class="img_grid">${builtImages}</div>`
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

const RoverData = (rovers) => {
    console.log('store start: ', store)
    if (rovers === '' ) {
        getRoverData(store)
        console.log('store : ', store)
    }
}


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
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
    let { rovers } = state

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rovers => updateStore(store, { rovers }))
    return data
}