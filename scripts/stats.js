import * as functions from '../modules/functions.js';

functions.loadEvents().then(eventsData => {
    if (eventsData && eventsData.events) {
        let currentDate = new Date(eventsData.currentDate)
        console.log("Fecha actual de la API:", currentDate)

        let pastEvents = eventsData.events.filter(event => new Date(event.date) < currentDate);
        console.log("Eventos pasados:", pastEvents);
        
        let categoryStats = calculateCategoryStats(pastEvents);
        
        fillTable(categoryStats)
    } else {
        console.error('No se encontraron eventos en los datos.')
    }
}).catch(error => {
    console.error('Error al cargar eventos:', error)
})

function calculateCategoryStats(events) {
    let stats = {}

    events.forEach(event => {
        let category = event.category
        let revenue = event.price
        let attendance = event.assistance || 0

        if (!stats[category]) {
            stats[category] = { totalRevenue: 0, totalAttendance: 0, eventCount: 0 }
        }

        stats[category].totalRevenue += revenue
        stats[category].totalAttendance += attendance
        stats[category].eventCount += 1
    });

    for (let category in stats) {
        stats[category].percentageAttendance = (stats[category].totalAttendance / (stats[category].eventCount * 100)) * 100
    }

    return stats
}

function fillTable(categoryStats) {
    let bodyTable = document.getElementById("bodyTable")
    

    let past = document.createElement("tr")
    past.innerHTML = `<th scope="row" class="table-danger" colspan="3">Past events statistics by category</th>`
    bodyTable.appendChild(past)

    let row2 = document.createElement("tr")
    row2.innerHTML = `
        <td class="text-body-secondary">Categories</td>
        <td class="text-body-secondary">Revenues</td>
        <td class="text-body-secondary">Percentage of assistance</td>
    `
    bodyTable.appendChild(row2);

    for (let category in categoryStats) {
        let row = document.createElement("tr")
        row.innerHTML = `
            <td>${category}</td>
            <td>USD ${categoryStats[category].totalRevenue.toFixed(2)}</td>
            <td>${categoryStats[category].percentageAttendance.toFixed(2)}%</td>
        `
        bodyTable.appendChild(row);
    }
}