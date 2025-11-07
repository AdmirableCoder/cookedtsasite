/* script.js */
import { db, resourcesCollection } from "./firebase.js";
import { getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const adminPanel = document.getElementById("admin-panel");
const pendingList = document.getElementById("pending-list");
const approvedList = document.getElementById("approved-list");

// Simple hardcoded admin login
loginBtn.addEventListener("click", () => {
const username = usernameInput.value.trim();
const password = passwordInput.value.trim();

if (username === "admin" && password === "password") {
    document.getElementById("login-form").classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadResources();
} else {
    loginError.textContent = "Invalid username or password";
}

});

// Load resources from Firestore
async function loadResources() {
approvedList.innerHTML = "";
pendingList.innerHTML = "";

const q = query(resourcesCollection);
const snapshot = await getDocs(q);

snapshot.forEach(doc => {
    const data = doc.data();
    const resourceHTML = `
        <div class="resource">
            <p><strong>${data.title}</strong></p>
            <p>Category: ${data.category}</p>
            <p>Description: ${data.description}</p>
            <p>Link: <a href="${data.link}" target="_blank">${data.link}</a></p>
        </div>
    `;
    if (data.approved) {
        approvedList.innerHTML += resourceHTML;
    } else {
        pendingList.innerHTML += resourceHTML;
    }
});

}

// Example function to add a new resource (called from admin panel)
export async function addResource(title, category, description, link) {
await addDoc(resourcesCollection, {
title,
category,
description,
link,
approved: false // admins can approve later
});
await loadResources();
}