let mindhubUrl = 'https://aulamindhub.github.io/amazing-api/events.json'

export async function fetchEvents() {
    try {
        let response = await fetch(mindhubUrl)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error
    }
}

export async function initialize() {
    try {
        let data = await fetchEvents();
        let categories = [...new Set(data.events.map(event => event.category))];

        cardsGenerator(data.events);
        checkboxGenerator(categories, data.events);

        document.querySelector("#searchBar").addEventListener('keyup', (eventExecuted) => {
            filterAndDisplayEvents(data.events);
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

export async function loadEvents() {
    try {
        let eventsData = await fetchEvents()
        console.log(eventsData)
        
        let currentDate = new Date(eventsData.currentDate)
        console.log("Fecha actual de la API:", currentDate);

        let pastEvents = eventsData.events.filter(event => new Date(event.date) < currentDate);
        
    
        let categoryStats = calculateCategoryStats(pastEvents); 

    
        fillTable(categoryStats);
        
    } catch (error) {
        console.error('Error al cargar eventos:', error);
    }
}

export function textFilter(eventsArray) {
    let text = document.querySelector("#searchBar").value.toLowerCase();
    return eventsArray.filter(event => 
        event.name.toLowerCase().includes(text) || 
        event.description.toLowerCase().includes(text)
    );
}

export function filterAndDisplayEvents(eventsArray) {
    let filteredEvents = textFilter(eventsArray);
    let checkboxChecked = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(e => e.value);
    
    if (checkboxChecked.length > 0) {
        filteredEvents = filteredEvents.filter(event => checkboxChecked.includes(event.category));
    }

    if (filteredEvents.length > 0) {
        cardsGenerator(filteredEvents);
    } else {
        noResults();
    }
}

export function noResults() {
    document.querySelector("#cardsContainer").innerHTML = `
        <div class="alert alert-danger text-center mt-5" role="alert">
            No events were found with this name or description
        </div>
    `;
}

export function checkboxGenerator(categories, eventsArray) {
    let checkboxContainer = document.querySelector("#checkboxsContainer");
    categories.forEach(category => {
        let newCheckbox = document.createElement('div');
        newCheckbox.className = "form-check-inline form-check";
        newCheckbox.innerHTML = `
            <input id="${category}" type="checkbox" class="form-check-input" value="${category}">
            <label class="form-check-label" for="${category}"> ${category}</label>
        `


        checkboxContainer.appendChild(newCheckbox);

        newCheckbox.querySelector('input').addEventListener('change', () => {
            filterAndDisplayEvents(eventsArray);
        });
    });
}

export function cardsGenerator(events) {
    let container = document.getElementById("cardsContainer");
    container.innerHTML = '';

    events.forEach((e) => {
        let card = document.createElement('div');
        card.classList.add('card', 'col', 'm-3', 'p-0', 'd-flex', 'justify-content-center', 'align-items-center');
        card.dataset.category = e.category;

        card.innerHTML = `
            <div class="card col d-flex">
                <img class="card-img-top" src="${e.image}" alt="${e.category}">
                <div class="card-body d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    <h5 class="card-title">${e.name}</h5>
                    <p class="card-text">${e.description}</p>
                    <p class="card-text">${e.category}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <span>USD ${e.price}</span>
                    <a href="./details.html?id=${e._id}" class="btn btn-info">Details</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function calculateCategoryStats(events) {
    let stats = {};

    events.forEach(event => {
        let category = event.category;
        let revenue = event.price;
        let attendance = event.assistance || 0; 

        if (!stats[category]) {
            stats[category] = { totalRevenue: 0, totalAttendance: 0, eventCount: 0 };
        }

        stats[category].totalRevenue += revenue;
        stats[category].totalAttendance += attendance;
        stats[category].eventCount += 1;
    });

    
    for (let category in stats) {
        stats[category].percentageAttendance = (stats[category].totalAttendance / (stats[category].eventCount * 100)) * 100; // Suponiendo que la asistencia se mide sobre 100
    }

    return stats;
}


function fillTable(categoryStats) {
    let bodyTable = document.getElementById("bodyTable");
    

    let past = document.createElement("tr");
    past.innerHTML = `<th scope="row" class="table-danger" colspan="3">Past events statistics by category</th>`;
    bodyTable.appendChild(past);

  
    let row2 = document.createElement("tr");
    row2.innerHTML = `
        <td class="text-body-secondary">Categories</td>
        <td class="text-body-secondary">Revenues</td>
        <td class="text-body-secondary">Percentage of assistance</td>
    `;
    bodyTable.appendChild(row2);

   
    for (let category in categoryStats) {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${category}</td>
            <td>USD ${categoryStats[category].totalRevenue.toFixed(2)}</td>
            <td>${categoryStats[category].percentageAttendance.toFixed(2)}%</td>
        `;
        bodyTable.appendChild(row);
    }
}