// script.js
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const resourcesDiv = document.getElementById("resources");
const addResourceForm = document.getElementById("addResourceForm");
const isAdmin = localStorage.getItem("isAdmin") === "true";

async function loadResources() {
  const snapshot = await getDocs(collection(db, "resources"));
  resourcesDiv.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("resource-card");
    div.innerHTML = `
      <h3>${data.name}</h3>
      <p>${data.description}</p>
      <a href="${data.link}" target="_blank">Visit</a>
      ${isAdmin && !data.approved ? `
        <button onclick="approveResource('${docSnap.id}')">Approve</button>
        <button onclick="denyResource('${docSnap.id}')">Deny</button>
      ` : ""}
      ${!data.approved && !isAdmin ? `<p><i>Pending approval</i></p>` : ""}
    `;
    if (data.approved || isAdmin) resourcesDiv.appendChild(div);
  });
}

window.approveResource = async function(id) {
  await updateDoc(doc(db, "resources", id), { approved: true });
  loadResources();
};

window.denyResource = async function(id) {
  await deleteDoc(doc(db, "resources", id));
  loadResources();
};

addResourceForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("resourceName").value;
  const link = document.getElementById("resourceLink").value;
  const description = document.getElementById("resourceDescription").value;

  await addDoc(collection(db, "resources"), {
    name,
    link,
    description,
    approved: false,
  });

  addResourceForm.reset();
  alert("Resource submitted for admin approval.");
});

loadResources();
