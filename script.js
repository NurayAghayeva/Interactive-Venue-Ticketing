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

const seatDetails = document.getElementById("seat-details");
const addToCartButton = document.getElementById("add-to-cart");

let selectedSeat = null;


const cart = [];

const STORAGE_KEY = "venueTicketCart";


const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("total");

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

                seatButton.dataset.seatId = seat.id;
                seatButton.setAttribute("aria-pressed", "false");


                seatButton.title = seat.id + " | " + seat.price + " AZN";
                seatButton.setAttribute("aria-label", seat.title || seatButton.title);

            if (!seat.available) {
                seatButton.classList.add("unavailable");
                seatButton.disabled = true;
            } else {
                seatButton.addEventListener("click", function () {
                    selectSeat(seat);
                });
            }

            rowDiv.appendChild(seatButton);

            }
        }

        seatMap.appendChild(rowDiv);
    }
}

console.log("All seats:", seats);
console.log("Total seats:", seats.length);


function selectSeat(seat) {
    selectedSeat = seat;

    updateSeatColors();
    updateSeatDetails();
}



function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    for (const seat of cart) {
        total += seat.price;

        const item = document.createElement("div");
        item.className = "cart-item";

        const label = document.createElement("span");
        label.textContent = seat.id + " - " + seat.price + " AZN";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", function () {
            removeFromCart(seat.id);
        });

        item.appendChild(label);
        item.appendChild(removeButton);
        cartItems.appendChild(item);
    }

    totalElement.textContent = total;
}

function removeFromCart(seatId) {
    const index = cart.findIndex(function (seat) {
        return seat.id === seatId;
    });

    if (index !== -1) {
        cart.splice(index, 1);
    }
    saveCart();

    updateCart();
    updateSeatColors();
    updateSeatDetails();
}

function updateSeatColors() {
    const buttons = document.querySelectorAll(".seat");

    for (const button of buttons) {
        const id = button.dataset.seatId;

        button.classList.remove("selected", "in-cart");

        const inCart = cart.some(function (seat) {
            return seat.id === id;
        });

        if (inCart) {
            button.classList.add("in-cart");
        } else if (selectedSeat && selectedSeat.id === id) {
            button.classList.add("selected");
        }

        button.setAttribute(
            "aria-pressed",
            selectedSeat !== null && selectedSeat.id === id
                ? "true"
                : "false"
        );
    }
}

function updateSeatDetails() {
    if (selectedSeat === null) {
        seatDetails.textContent = "Click a seat to see its details.";
        addToCartButton.disabled = true;
        addToCartButton.textContent = "ADD TO CART";
        return;
    }

    seatDetails.innerHTML = `
        <p><strong>Section:</strong> ${selectedSeat.section}</p>
        <p><strong>Row:</strong> ${selectedSeat.row}</p>
        <p><strong>Seat:</strong> ${selectedSeat.number}</p>
        <p><strong>Price:</strong> ${selectedSeat.price} AZN</p>
    `;

    const alreadyInCart = cart.some(function (seat) {
        return seat.id === selectedSeat.id;
    });

    addToCartButton.disabled = alreadyInCart;
    addToCartButton.textContent = alreadyInCart
        ? "ALREADY IN CART"
        : "ADD TO CART";
}

// Add selected ticket to cart
addToCartButton.addEventListener("click", function () {
    if (selectedSeat === null || !selectedSeat.available) {
        return;
    }

    const alreadyInCart = cart.some(function (seat) {
        return seat.id === selectedSeat.id;
    });

    if (alreadyInCart) {
        return;
    }

    
cart.push(selectedSeat);

saveCart();

updateCart();
updateSeatColors();
updateSeatDetails();

});

// Restore saved tickets when the page opens
loadCart();

// Update the cart and seat colors
updateCart();
updateSeatColors();
updateSeatDetails();


function saveCart() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart.map(seat => seat.id))
    );
}


function loadCart() {
    const savedCart = localStorage.getItem(STORAGE_KEY);

    if (!savedCart) {
        return;
    }

    try {
        const savedIds = JSON.parse(savedCart);

        if (!Array.isArray(savedIds)) {
            return;
        }

        for (const id of savedIds) {
            const seat = seats.find(function (item) {
                return item.id === id;
            });

            if (
                seat &&
                seat.available &&
                !cart.some(item => item.id === seat.id)
            ) {
                cart.push(seat);
            }
        }
    } catch (error) {
        console.error("Could not load saved cart:", error);
    }
}
