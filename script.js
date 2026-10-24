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

const seatMap = document.getElementById("seat-map");

for (const section of sections) {

    const heading = document.createElement("h3");
    heading.textContent = section.name;
    seatMap.appendChild(heading);

    for (let row = 1; row <= section.rows; row++) {

        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        for (let number = 1; number <= section.seatsPerRow; number++) {

            const seat = document.createElement("button");

            seat.className = "seat";
            seat.type = "button";

            const seatId = section.name + "-" + row + "-" + number;

            seat.title = seatId + " | " + section.price + " AZN";
            seat.setAttribute("aria-label", seat.title);

            rowDiv.appendChild(seat);
        }

        seatMap.appendChild(rowDiv);
    }
}
