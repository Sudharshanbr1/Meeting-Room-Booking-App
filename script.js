const form = document.getElementById("bookingForm");
const tableBody = document.getElementById("bookingsTable");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function updateStorage() {
  localStorage.setItem("bookings", JSON.stringify(bookings));
  renderBookings();
}

function renderBookings() {
  tableBody.innerHTML = "";
  bookings.forEach((b, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.title}</td>
      <td>${b.room}</td>
      <td>${b.date}</td>
      <td>${b.start}</td>
      <td>${b.end}</td>
      <td>
        <button class="edit-btn" onclick="editBooking(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteBooking(${i})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const booking = {
    title: form.title.value,
    room: form.room.value,
    date: form.date.value,
    start: form.start.value,
    end: form.end.value
  };

  if (booking.start >= booking.end) {
    return alert("End time must be after start time.");
  }

  if (isConflict(booking)) {
    return alert("Room is already booked at this time.");
  }

  bookings.push(booking);
  form.reset();
  updateStorage();
});

function isConflict(newBooking) {
  return bookings.some(b =>
    b.room === newBooking.room &&
    b.date === newBooking.date &&
    !(newBooking.end <= b.start || newBooking.start >= b.end)
  );
}

function deleteBooking(index) {
  if (confirm("Delete this booking?")) {
    bookings.splice(index, 1);
    updateStorage();
  }
}

function editBooking(index) {
  const b = bookings[index];
  form.title.value = b.title;
  form.room.value = b.room;
  form.date.value = b.date;
  form.start.value = b.start;
  form.end.value = b.end;
  bookings.splice(index, 1);
  updateStorage();
}

renderBookings();
