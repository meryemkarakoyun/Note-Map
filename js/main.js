import { ui, personIcon } from "./ui.js";
import { getNoteIcon, formatDate, getStatus, statusObj } from "./helpers.js";

const STATE = {
  map: null,
  layer: null,
  clickedCoords: null,
  notes: JSON.parse(localStorage.getItem("notes") || "[]"),
};

window.navigator.geolocation.getCurrentPosition(
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  () => loadMap([41.104187, 29.051014])
);

//*Leaflet haritasının kurulumu
function loadMap(position) {
  STATE.map = L.map("map", { zoomControl: false }).setView(position, 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(STATE.map);
  L.control.zoom({ position: "bottomright" }).addTo(STATE.map);
  //harrita üzerinde bir layer oluştur
  STATE.layer = L.layerGroup().addTo(STATE.map);
  const marker = L.marker(position, { icon: personIcon }).addTo(STATE.map);

  marker.bindPopup("<b>Buradasınız</b>");
  STATE.map.on("click", onMapClick);

  renderNoteCards(STATE.notes);
  renderMarker(STATE.notes);
}

function onMapClick(e) {
  STATE.clickedCoords = [e.latlng.lat, e.latlng.lng];

  ui.aside.classList.add("add");
  ui.asideTitle.textContent = "Yeni Not";
}

ui.cancelButton.addEventListener("click", () => {
  ui.aside.classList.remove("add");

  ui.asideTitle.textContent = "Notlar";
});

ui.arrow.addEventListener("click", () => {
  ui.aside.classList.toggle("hide");
});

ui.form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  if (!title || !date || !status) {
    return alert("Lütfen formu doldurunuz!");
  }

  const newNote = {
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: STATE.clickedCoords,
  };

  STATE.notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(STATE.notes));

  ui.aside.classList.remove("add");
  ui.asideTitle.textContent = "Notlar";

  renderNoteCards(STATE.notes);
  renderMarker(STATE.notes);
});

function renderMarker(notes) {
  STATE.layer.clearLayers();
  notes.forEach((note) => {
    const icon = getNoteIcon(note.status);

    const marker = L.marker(note.coords, { icon }).addTo(STATE.layer);

    marker.bindPopup(`<p class="popup">${note.title}<p>`);
  });
}

function renderNoteCards(notes) {
  console.log(notes);

  const notesHtml = notes
    .map(
      (note) => ` <li>
          <div>
            <h3>${note.title}</h3>
            <p>${formatDate(note.date)}</p>
            <p class="status">${getStatus(note.status)}</p>
          </div>
          <div class="icons">
            <i data-id="${
              note.id
            }" id="fly-btn" class="bi bi-airplane-fill"></i>
            <i data-id="${note.id}" id="trash-btn" class="bi bi-trash"></i>
          </div>
        </li>`
    )
    .join(" ");
  ui.noteList.innerHTML = notesHtml;

  document.querySelectorAll("#trash-btn").forEach((btn) => {
    const id = +btn.dataset.id;

    btn.addEventListener("click", () => deleteNote(id));
  });

  document.querySelectorAll("#fly-btn").forEach((btn) => {
    const id = +btn.dataset.id;

    btn.addEventListener("click", () => flyToNote(id));
  });
}

const deleteNote = (id) => {
  if (!confirm("Notu silmek istediğinizden emin misiniz?")) return;

  STATE.notes = STATE.notes.filter((note) => note.id !== id);

  localStorage.setItem("notes", JSON.stringify(STATE.notes));

  renderMarker(STATE.notes);
  renderNoteCards(STATE.notes);
};

const flyToNote = (id) => {
  //Tıklanılan notun verilerine eriş
  const note = STATE.notes.find((note) => note.id === id);

  STATE.map.flyTo(note.coords, 15);
};
