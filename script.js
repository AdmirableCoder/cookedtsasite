import { initializeApp } from "./firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "./firebase-firestore.js";

// Initialize Firebase (firebase.js handles your config)
import { app, db } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {

  const resourceList = document.getElementById("resource-list");

  // Hardcoded preloaded resources
  const preloadedResources = [
    { name: "Resource 1", desc: "Description 1", url: "https://example.com/1", category: "math" },
    { name: "Resource 2", desc: "Description 2", url: "https://example.com/2", category: "science" },
    // add more as needed
  ];

  function renderResources() {
    if (!resourceList) return;
    resourceList.innerHTML = "";

    // Render preloaded resources
    preloadedResources.forEach(res => {
      const li = document.createElement("li");
      li.dataset.category = res.category;
      li.innerHTML = `
        <h3>${res.name}</h3>
        <p><b>Category:</b> ${res.category}</p>
        <p><b>Description:</b> ${res.desc}</p>
        <p><b>Link:</b> <a href="${res.url}" target="_blank">${res.url}</a></p>
      `;
      resourceList.appendChild(li);
    });
  }

  renderResources();

  // Add Resource Form (submits to Firestore only)
  const addResourceForm = document.getElementById("add-event-form");
  const submissionMessage = document.getElementById("submission-message");

  if (addResourceForm) {
    addResourceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("event-name").value.trim();
      const desc = document.getElementById("event-desc").value.trim();
      const url = document.getElementById("event-url").value.trim();
      const category = document.getElementById("event-category").value;

      if (!name || !desc || !url) {
        alert("Please fill out all fields before submitting.");
        return;
      }

      try {
        await addDoc(collection(db, "pendingResources"), {
          name,
          desc,
          url,
          category,
          timestamp: Date.now(),
        });

        addResourceForm.reset();
        if (submissionMessage)
          submissionMessage.textContent =
            "✅ Resource submitted and sent for review!";
      } catch (err) {
        console.error("Error adding resource:", err);
        alert("❌ Failed to submit. Please try again.");
      }
    });
  }

  // Admin Login
  const loginForm = document.getElementById("login-form");
  const adminPanel = document.getElementById("admin-panel");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "password123";

  async function renderPending() {
    const pendingList = document.getElementById("pending-list");
    pendingList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "pendingResources"));
    if (snapshot.empty) {
      pendingList.innerHTML = "<p>No pending resources.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const res = docSnap.data();
      const div = document.createElement("div");
      div.className = "resource-card";
      div.innerHTML = `
        <h3>${res.name}</h3>
        <p><b>Category:</b> ${res.category}</p>
        <p><b>Description:</b> ${res.desc}</p>
        <p><b>Link:</b> <a href="${res.url}" target="_blank">${res.url}</a></p>
        <button onclick="approve('${docSnap.id}', '${res.name}', '${res.desc}', '${res.url}', '${res.category}')">Approve</button>
        <button onclick="deny('${docSnap.id}')">Deny</button>
      `;
      pendingList.appendChild(div);
    });
  }

  async function renderApproved() {
    const approvedList = document.getElementById("approved-list");
    approvedList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "resources"));
    if (snapshot.empty) {
      approvedList.innerHTML = "<p>No approved resources.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const res = docSnap.data();
      const div = document.createElement("div");
      div.className = "resource-card";
      div.innerHTML = `
        <h3>${res.name}</h3>
        <p><b>Category:</b> ${res.category}</p>
        <p><b>Description:</b> ${res.desc}</p>
        <p><b>Link:</b> <a href="${res.url}" target="_blank">${res.url}</a></p>
        <button onclick="removeApproved('${docSnap.id}')">Remove</button>
      `;
      approvedList.appendChild(div);
    });
  }

  window.approve = async function (id, name, desc, url, category) {
    await addDoc(collection(db, "resources"), { name, desc, url, category });
    await deleteDoc(doc(db, "pendingResources", id));
    renderPending();
    renderApproved();
  };

  window.deny = async function (id) {
    await deleteDoc(doc(db, "pendingResources", id));
    renderPending();
  };

  window.removeApproved = async function (id) {
    await deleteDoc(doc(db, "resources", id));
    renderApproved();
  };

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        loginForm.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        renderPending();
        renderApproved();
      } else {
        if (loginError)
          loginError.textContent = "Incorrect username or password.";
      }
    });
  }

});
