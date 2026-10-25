
const sections = [
    {
        name: "VIP",
        price: 100,
        rows: 3,
        seatsPerRow: 10
    },
    {
        name: "Premium",
        price: 70,
        rows: 4,
        seatsPerRow: 12
    },
    {
        name: "Standard",
        price: 40,
        rows: 5,
        seatsPerRow: 14
    }
];

// Seats that cannot be booked
const unavailableSeats = [
    "VIP-1-3",
    "VIP-2-7",
    "Premium-1-5",
    "Premium-3-9",
    "Standard-2-4",
    "Standard-4-10"
];

// Array to store all seats
const seats = [];

// Generate seat information
for (const section of sections) {

    for (let row = 1; row <= section.rows; row++) {

        for (let number = 1; number <= section.seatsPerRow; number++) {

            const seatId = section.name + "-" + row + "-" + number;

            const seat = {
                id: seatId,
                section: section.name,
                row: row,
                number: number,
                price: section.price,
                available: !unavailableSeats.includes(seatId)
            };

            seats.push(seat);
        }
    }
}

// Find the seat map container
const seatMap = document.getElementById("seat-map");

// Display seats on the website
for (const section of sections) {

    const heading = document.createElement("h3");
    heading.textContent = section.name;
    seatMap.appendChild(heading);

    for (let row = 1; row <= section.rows; row++) {

        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        for (const seat of seats) {

            if (seat.section === section.name && seat.row === row) {

                const seatButton = document.createElement("button");

                seatButton.className = "seat";
                seatButton.type = "button";

                seatButton.title = seat.id + " | " + seat.price + " AZN";
                seatButton.setAttribute("aria-label", seat.title || seatButton.title);

                if (!seat.available) {
                    seatButton.classList.add("unavailable");
                    seatButton.disabled = true;
                }

                rowDiv.appendChild(seatButton);
            }
        }

        seatMap.appendChild(rowDiv);
    }
}

console.log("All seats:", seats);
console.log("Total seats:", seats.length);
