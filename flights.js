const airtableApiKey = "patzHLAT75PrYMFmp.44ea1c1498ed33513020e65b1fdf5e9ec4839804737275780347d53b9c9dbf3f";
const baseId = "appNQL4G3kqHBCJIk";
const tableName = "جدول الرحلات";

const username = localStorage.getItem("username");

async function fetchUserFlights() {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(`{اسم المنسق} = '${username}'`)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${airtableApiKey}` }
  });
  const data = await res.json();
  return data.records || [];
}

function generateCard(flight) {
  const f = flight.fields;
  const div = document.createElement("div");
  div.className = "flight-card";
  div.innerHTML = `
    <p><strong>FLT.NO:</strong> ${f["FLT.NO"] || "-"}</p>
    <p><strong>Date:</strong> ${f["Date"] || "-"}</p>
    <p><strong>Time on Chocks:</strong> ${f["Time on Chocks"] || "-"}</p>
    <p><strong>Time open Door:</strong> ${f["Time open Door"] || "-"}</p>
    <p><strong>Time Start Cleaning:</strong> ${f["Time Start Cleaning"] || "-"}</p>
    <p><strong>Time complete cleaning:</strong> ${f["Time complete cleaning"] || "-"}</p>
    <p><strong>Time ready boarding:</strong> ${f["Time ready boarding"] || "-"}</p>
    <p><strong>Time start boarding:</strong> ${f["Time start boarding"] || "-"}</p>
    <p><strong>Boarding Complete:</strong> ${f["Boarding Complete"] || "-"}</p>
    <p><strong>Time Close Door:</strong> ${f["Time Close Door"] || "-"}</p>
    <p><strong>Time off Chocks:</strong> ${f["Time off Chocks"] || "-"}</p>
    <p><strong>NOTES:</strong> ${f["NOTES"] || "-"}</p>
    <p><strong>اسم المنسق:</strong> ${f["اسم المنسق"] || "-"}</p>
    <button onclick="exportFlight('${flight.id}')">📄 تصدير</button>
  `;
  return div;
}

async function exportFlight(id) {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${id}`, {
    headers: { Authorization: `Bearer ${airtableApiKey}` }
  });
  const { fields } = await res.json();

  const tableRows = Object.entries(fields).map(([key, value]) => {
    return `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
  });

  const content = `<table border="1" style="border-collapse:collapse; width:100%">${tableRows.join("")}</table>`;
  const blob = new Blob(["﻿" + content], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Flight-${fields["FLT.NO"] || "بدون-رقم"}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.exportFlight = exportFlight;

window.onload = async () => {
  const container = document.getElementById("saved-flights");
  const logoutBtn = document.getElementById("logoutBtn");
  const flights = await fetchUserFlights();
  if (flights.length === 0) {
    container.innerHTML = "<p>لا توجد رحلات مسجلة.</p>";
  } else {
    flights.forEach(f => container.appendChild(generateCard(f)));
  }

  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "index.html";
  };
};