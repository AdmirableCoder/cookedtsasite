
  import { db } from "./firebase.js";
  import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
  } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

  document.addEventListener("DOMContentLoaded", () => {
    // ----------------- GLOBAL SEARCH -----------------
    const globalSearchForm = document.getElementById("global-search-form");
    const globalSearchInput = document.getElementById("global-search-input");
    if (globalSearchForm) {
      globalSearchForm.addEventListener("submit", e => {
        e.preventDefault();
        const query = globalSearchInput.value.trim();
        if (query) {
          window.location.href = `resources.html?search=${encodeURIComponent(query)}`;
        }
      });
    }

    // ----------------- RESOURCE PAGE -----------------
    const resourceList = document.getElementById("resource-list");
    const searchInput = document.getElementById("search-input");
    const categorySelect = document.getElementById("category-select");

    // Realtime approved resources
    if (resourceList) {
      const q = query(collection(db, "resources"), orderBy("timestamp", "desc"));
      onSnapshot(q, snapshot => {
        resourceList.innerHTML = "";
        snapshot.forEach(docSnap => {
          const res = docSnap.data();
          const li = document.createElement("li");
          li.dataset.category = res.category || "other";
          li.innerHTML = `
            <h3>${res.name}</h3>
            <p><b>Category:</b> ${res.category}</p>
            <p><b>Description:</b> ${res.desc}</p>
            <p><b>Link:</b> <a href="${res.url}" target="_blank">${res.url}</a></p>
          `;
          resourceList.appendChild(li);
        });
      });
    }

    // ----------------- ADD RESOURCE -----------------
    const addResourceForm = document.getElementById("add-event-form");
    const submissionMessage = document.getElementById("submission-message");

    if (addResourceForm) {
      addResourceForm.addEventListener("submit", async e => {
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
            name, desc, url, category, timestamp: Date.now()
          });
          addResourceForm.reset();
          if (submissionMessage)
            submissionMessage.textContent = "✅ Resource submitted and sent for review!";
        } catch (err) {
          console.error("Error adding resource:", err);
          alert("❌ Failed to submit. Please try again.");
        }
      });
    }

    // ----------------- ADMIN PANEL -----------------
    const loginForm = document.getElementById("login-form");
    const adminPanel = document.getElementById("admin-panel");
    const loginBtn = document.getElementById("login-btn");
    const loginError = document.getElementById("login-error");

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";

    async function renderPending() {
      const pendingList = document.getElementById("pending-list");
      if (!pendingList) return;

      const q = query(collection(db, "pendingResources"), orderBy("timestamp", "desc"));
      onSnapshot(q, snapshot => {
        pendingList.innerHTML = "";
        if (snapshot.empty) pendingList.innerHTML = "<p>No pending resources.</p>";
        snapshot.forEach(docSnap => {
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
      });
    }

    async function renderApproved() {
      const approvedList = document.getElementById("approved-list");
      if (!approvedList) return;

      const q = query(collection(db, "resources"), orderBy("timestamp", "desc"));
      onSnapshot(q, snapshot => {
        approvedList.innerHTML = "";
        if (snapshot.empty) approvedList.innerHTML = "<p>No approved resources.</p>";
        snapshot.forEach(docSnap => {
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
      });
    }

    window.approve = async (id, name, desc, url, category) => {
      await addDoc(collection(db, "resources"), { name, desc, url, category, timestamp: Date.now() });
      await deleteDoc(doc(db, "pendingResources", id));
    };

    window.deny = async id => await deleteDoc(doc(db, "pendingResources", id));
    window.removeApproved = async id => await deleteDoc(doc(db, "resources", id));

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          loginForm.classList.add("hidden");
          adminPanel.classList.remove("hidden");
          renderPending();
          renderApproved();
        } else if (loginError) {
          loginError.textContent = "Incorrect username or password.";
        }
      });
    }
  });
