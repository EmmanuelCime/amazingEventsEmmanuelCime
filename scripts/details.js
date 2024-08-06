import * as functions from "../modules/functions.js"

let eventsData

async function initialize() {
    eventsData = await functions.initialize()
    let eventId = new URLSearchParams(window.location.search).get("id")
    
    eventsData.events.forEach(e => {
        if (e._id == eventId) {
            detailsCard(e)
        }
    })
}


initialize()

function detailsCard(element) {
    let container = document.querySelector("#detailsContainer")
    container.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${element.image}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <p class="card-text">${element.description}</p>
                        <p class="card-text">Date: ${element.date}</p>
                        <p class="card-text">Category: ${element.category}</p>
                        <p class="card-text">Place: ${element.place}</p>
                        <p class="card-text">Capacity: ${element.capacity}</p>
                        <p class="card-text">Assistance or Estimate: ${element.assistance ? element.assistance : element.estimate}</p>
                        <p class="card-text">Price: USD ${element.price}</p>
                    </div>
                </div>
            </div>
        </div>
    `
}