/* script.js */

// Admin login elements
const loginForm = document.getElementById("login-form");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");

// Resource form elements
const addResBtn = document.getElementById("add-resource-btn");
const resTitleInput = document.getElementById("res-title");
const resCategoryInput = document.getElementById("res-category");
const resDescInput = document.getElementById("res-desc");
const resLinkInput = document.getElementById("res-link");

// Resource display
const resourcesList = document.getElementById("resources-list");

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password";

// Preloaded resources (can remove if you want all dynamic)
let resources = [
{
title: "Resource 1",
category: "category1",
description: "Description 1",
link: "[https://example.com/1](https://example.com/1)"
},
{
title: "Resource 2",
category: "category2",
description: "Description 2",
link: "[https://example.com/2](https://example.com/2)"
}
];

// Login function
loginBtn.addEventListener("click", () => {
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
loginForm.classList.add("hidden");
adminPanel.classList.remove("hidden");
renderResources();
} else {
loginError.textContent = "Invalid username or password.";
}
});

// Add resource
addResBtn.addEventListener("click", () => {
const title = resTitleInput.value;
const category = resCategoryInput.value;
const description = resDescInput.value;
const link = resLinkInput.value;

if (!title || !category || !description || !link) {
alert("Please fill in all fields.");
return;
}

const newRes = { title, category, description, link };
resources.push(newRes);

// Reset input fields
resTitleInput.value = "";
resCategoryInput.value = "";
resDescInput.value = "";
resLinkInput.value = "";

renderResources();
});

// Render resources to page
function renderResources() {
resourcesList.innerHTML = "";

if (resources.length === 0) {
resourcesList.innerHTML = "<p>No resources yet.</p>";
return;
}

resources.forEach((res, index) => {
const div = document.createElement("div");
div.innerHTML = `       <h3>${res.title}</h3>       <p><strong>Category:</strong> ${res.category}</p>       <p><strong>Description:</strong> ${res.description}</p>       <p><strong>Link:</strong> <a href="${res.link}" target="_blank">${res.link}</a></p>       <button onclick="removeResource(${index})">Remove</button>       <hr>
    `;
resourcesList.appendChild(div);
});
}

// Remove a resource
function removeResource(index) {
resources.splice(index, 1);
renderResources();
}

// Initial render
renderResources();
