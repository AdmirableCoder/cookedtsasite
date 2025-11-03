document.addEventListener("DOMContentLoaded", () => {
  const PENDING_KEY = "pendingResources";
  const RESOURCES_KEY = "resources";

  /* -----------------------------
      FILTER & SEARCH (resources.html)
    ----------------------------- */
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");
  const resourceList = document.getElementById("resource-list");

  /* -----------------------------
      LOAD APPROVED RESOURCES ONLY
    ----------------------------- */
  if (resourceList) {
    const savedResources =
      JSON.parse(localStorage.getItem(RESOURCES_KEY)) || [];
    savedResources.forEach((res) => {
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
  }

  /* -----------------------------
      ADD NEW RESOURCE (add_resources.html)
    ----------------------------- */
  const addResourceForm = document.getElementById("add-event-form");
  const submissionMessage = document.getElementById("submission-message");

  if (addResourceForm) {
    addResourceForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("event-name").value.trim();
      const desc = document.getElementById("event-desc").value.trim();
      const url = document.getElementById("event-url").value.trim();
      const category = document.getElementById("event-category").value;

      if (!name || !desc || !url) {
        alert("Please fill out all fields before submitting.");
        return;
      }

      const newResource = { name, desc, url, category };
      const pendingResources =
        JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
      pendingResources.push(newResource);
      localStorage.setItem(PENDING_KEY, JSON.stringify(pendingResources));

      addResourceForm.reset();
      submissionMessage.textContent =
        "✅ Resource submitted and sent for review!";
    });
  }

  /* -----------------------------
      ADMIN LOGIN & APPROVE/DENY/REMOVE
    ----------------------------- */
  const loginForm = document.getElementById("login-form");
  const adminPanel = document.getElementById("admin-panel");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "password123";

  function renderPending() {
    const pendingList = document.getElementById("pending-list");
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
    pendingList.innerHTML = "";

    if (pending.length === 0) {
      pendingList.innerHTML = "<p>No pending resources.</p>";
      return;
    }

    pending.forEach((res, index) => {
      const div = document.createElement("div");
      div.className = "resource-card";
      div.innerHTML = `
          <h3>${res.name}</h3>
          <p><b>Category:</b> ${res.category}</p>
          <p><b>Description:</b> ${res.desc}</p>
          <p><b>Link:</b> <a href="${res.url}" target="_blank">${res.url}</a></p>
          <button onclick="approve(${index})">Approve</button>
          <button onclick="deny(${index})">Deny</button>
        `;
      pendingList.appendChild(div);
    });
  }

  function renderApproved() {
    const approvedList = document.getElementById("approved-list");
    const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY)) || [];
    approvedList.innerHTML = "";

    if (resources.length === 0) {
      approvedList.innerHTML = "<p>No approved resources.</p>";
      return;
    }

    resources.forEach((res, index) => {
      const div = document.createElement("div");
      div.className = "resource-card";
      div.innerHTML = `
          <h3>${res.name}</h3>
          <p><b>Category:</b> ${res.category}</p>
          <p><b>Description:</b> ${res.desc}</p>
          <p><b>Link:</b> <a href="${res.url}" target="_blank">${res.url}</a></p>
          <button onclick="removeApproved(${index})">Remove</button>
        `;
      approvedList.appendChild(div);
    });
  }

  window.approve = function (index) {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
    const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY)) || [];
    resources.push(pending[index]);
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));

    pending.splice(index, 1);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    renderPending();
    renderApproved();
  };

  window.deny = function (index) {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY)) || [];
    pending.splice(index, 1);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    renderPending();
  };

  window.removeApproved = function (index) {
    const resources = JSON.parse(localStorage.getItem(RESOURCES_KEY)) || [];
    resources.splice(index, 1);
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
    renderApproved();
  };
  const list = document.getElementById("resource-list");
  const pagination = document.getElementById("pagination");

  if (list && pagination) {
    const items = Array.from(list.querySelectorAll("li"));

    const itemsPerPage = 3;
    let currentPage = 1;
    let filteredItems = [...items];

    function renderPage(page = 1) {
      list.innerHTML = "";
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = filteredItems.slice(start, end);

      pageItems.forEach((item) => list.appendChild(item));
      renderPagination();
    }

    function renderPagination() {
      pagination.innerHTML = "";
      const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.toggle("active", i === currentPage);
        btn.addEventListener("click", () => {
          currentPage = i;
          renderPage(currentPage);
        });
        pagination.appendChild(btn);
      }
    }
    function filterItems() {
      const search = (searchInput?.value || "").toLowerCase();
      const category = categorySelect?.value || "all";

      filteredItems = items.filter((item) => {
        const matchesCategory =
          category === "all" || item.dataset.category === category;
        const matchesSearch = item.textContent.toLowerCase().includes(search);
        return matchesCategory && matchesSearch;
      });

      currentPage = 1;
      renderPage(currentPage);
    }

    if (searchInput) searchInput.addEventListener("input", filterItems);
    if (categorySelect) categorySelect.addEventListener("change", filterItems);

    renderPage();
  }

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
        loginError.textContent = "Incorrect username or password.";
      }
    });
  }
});
