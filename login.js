const airtableApiKey = "patzHLAT75PrYMFmp.44ea1c1498ed33513020e65b1fdf5e9ec4839804737275780347d53b9c9dbf3f";
const baseId = "appNQL4G3kqHBCJIk";
const usersTable = "المستخدمين";

async function fetchUsers() {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${usersTable}`, {
    headers: { Authorization: `Bearer ${airtableApiKey}` }
  });
  const data = await res.json();
  const select = document.getElementById("username");
  data.records.forEach(rec => {
    const option = document.createElement("option");
    option.value = rec.fields["اسم المستخدم"];
    option.text = rec.fields["اسم المستخدم"];
    select.appendChild(option);
  });
}

window.login = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error");

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${usersTable}?filterByFormula={اسم المستخدم}='${username}'`, {
    headers: { Authorization: `Bearer ${airtableApiKey}` }
  });
  const data = await res.json();
  const user = data.records[0];

  if (user && user.fields["كلمة المرور"] === password) {
    localStorage.setItem("username", username);
    if (user.fields["الدور"] === "مسؤول") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "flights.html";
    }
  } else {
    errorBox.innerText = "اسم المستخدم أو كلمة المرور غير صحيحة.";
  }
};

fetchUsers();