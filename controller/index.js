import { mockData } from "../model/model.js";

// --- 2. CÁC HÀM TIỆN ÍCH HIỂN THỊ (RENDER HELPERS) ---
const getStatusBadge = (status) => {
  if (status === "new") return '<span class="badge badge-new">New</span>';
  if (status === "partial")
    return '<span class="badge badge-partial">Partial</span>';
  if (status === "done") return '<span class="badge badge-done">Done</span>';
  return "";
};

const getContentIcon = (hasContent) => {
  if (hasContent) {
    return '<svg class="icon-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  }
  return '<svg class="icon-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
};

const formatDateToDisplay = (dateString) => {
  // Chuyển từ "YYYY-MM-DD" sang "DD/MM/YYYY" nếu cần
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateString;
};

// --- 3. HÀM VẼ BẢNG (RENDER TABLE) ---
const renderTable = (data) => {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; // Làm sạch bảng

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" class="text-center" style="padding: 40px; color: #6B7280;">Không tìm thấy dữ liệu phù hợp với bộ lọc</td></tr>';
    return;
  }

  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                    <td class="font-medium">${item.title}</td>
                    <td>${item.metaTitle}</td>
                    <td class="truncate" title="${item.description}">${item.description}</td>
                    <td class="text-center">${getContentIcon(item.hasContent)}</td>
                    <td>${formatDateToDisplay(item.createdAt)}</td>
                    <td>${getStatusBadge(item.status)}</td>
                    <td>${item.updatedAt}</td>
                    <td class="actions">
                        <button class="btn-icon btn-paste-content" title="Dán nội dung" data-id="${item.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                        </button>
                        <button class="btn-icon btn-edit" title="Chỉnh sửa" data-id="${item.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon text-danger btn-delete" title="Xóa" data-id="${item.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </td>
                `;
    tbody.appendChild(tr);
  });

  // Gắn event listener cho các nút sau khi render xong
  attachButtonListeners();
};

// --- 3.5 GẮN EVENT LISTENER CHO CÁC NÚT ---
const attachButtonListeners = () => {
  // Nút Edit
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      openModal(id);
    });
  });

  // Nút Delete
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      deleteItem(id);
    });
  });

  // Nút Paste Content
  document.querySelectorAll(".btn-paste-content").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      openContentModal(id);
    });
  });
};

// --- Gắn event listener cho các phần tử modal ---
const attachModalListeners = () => {
  // Modal Chỉnh sửa
  const editModal = document.getElementById("editModal");
  const editCloseBtn = editModal.querySelector(".close-btn");
  const editCancelBtn = editModal.querySelector(".btn-cancel");
  const editSaveBtn = editModal.querySelectorAll(".btn-primary")[0]; // Nút lưu trong modal edit

  if (editCloseBtn) editCloseBtn.addEventListener("click", closeModal);
  if (editCancelBtn) editCancelBtn.addEventListener("click", closeModal);
  if (editSaveBtn) editSaveBtn.addEventListener("click", saveEdit);

  // Modal Dán nội dung
  const contentModal = document.getElementById("contentModal");
  const contentCloseBtn = contentModal.querySelector(".close-btn");
  const contentCancelBtn = contentModal.querySelector(".btn-cancel");
  const contentSaveBtn = contentModal.querySelector(".btn-primary");

  if (contentCloseBtn)
    contentCloseBtn.addEventListener("click", closeContentModal);
  if (contentCancelBtn)
    contentCancelBtn.addEventListener("click", closeContentModal);
  if (contentSaveBtn) contentSaveBtn.addEventListener("click", saveContent);
};

// Render dữ liệu mặc định khi vừa tải trang
renderTable(mockData);

// Gắn event listener khi DOM ready
document.addEventListener("DOMContentLoaded", () => {
  attachModalListeners();

  // Nút "Lấy nội dung"
  const fetchBtn = document.querySelector(".btn-primary[type='button']");
  if (fetchBtn) {
    fetchBtn.addEventListener("click", fetchContent);
  }
});

// --- 4. LOGIC TƯƠNG TÁC GIAO DIỆN DROPDOWN STATUS ---
const statusWrapper = document.getElementById("custom-status-wrapper");
const statusDisplay = document.getElementById("custom-status-display");
const statusOptions = document.querySelectorAll(".custom-option");
const statusInput = document.getElementById("status");

statusDisplay.addEventListener("click", () => {
  statusWrapper.classList.toggle("active");
});

statusOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const value = option.getAttribute("data-value");
    const html = option.innerHTML;

    statusDisplay.innerHTML = html;
    statusInput.value = value;
    statusWrapper.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!statusWrapper.contains(e.target)) {
    statusWrapper.classList.remove("active");
  }
});

// --- 5. LOGIC LỌC DỮ LIỆU KHI BẤM NÚT "Lấy nội dung" ---
function fetchContent() {
  // Lấy giá trị từ các trường filter
  const projectId = document.getElementById("project").value;
  const searchTerm = document
    .getElementById("searchData")
    .value.toLowerCase()
    .trim();
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;
  const status = document.getElementById("status").value;

  // Thực hiện lọc dữ liệu dựa trên mockData
  const filteredData = mockData.filter((item) => {
    let match = true;

    // Lọc theo Dự án
    if (projectId && item.projectId !== projectId) match = false;

    // Lọc theo Trạng thái
    if (status && item.status !== status) match = false;

    // Lọc theo Từ khóa (tìm trong Title và Description)
    if (searchTerm) {
      const titleMatch = item.title.toLowerCase().includes(searchTerm);
      const descMatch = item.description.toLowerCase().includes(searchTerm);
      if (!titleMatch && !descMatch) match = false;
    }

    // Lọc theo Ngày (so sánh chuỗi chuẩn format YYYY-MM-DD rất an toàn)
    if (dateFrom && item.createdAt < dateFrom) match = false;
    if (dateTo && item.createdAt > dateTo) match = false;

    return match;
  });

  // Vẽ lại bảng với dữ liệu đã được lọc
  renderTable(filteredData);

  // Thông báo lấy nội dung thành công
  alert("Lấy nội dung thành công!");
}

// --- 6. LOGIC XÓA (DELETE) VÀ SỬA (EDIT) ---
function deleteItem(id) {
  if (confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
    mockData = mockData.filter((item) => item.id !== id);
    fetchContent(); // Render lại bảng mà vẫn giữ bộ lọc hiện tại
  }
}

function openModal(id) {
  const item = mockData.find((d) => d.id === id);
  if (!item) return;

  document.getElementById("edit-id").value = item.id;
  document.getElementById("edit-title").value = item.title;
  document.getElementById("edit-metaTitle").value = item.metaTitle;
  document.getElementById("edit-description").value = item.description;
  document.getElementById("edit-status").value = item.status;

  document.getElementById("editModal").classList.add("active");
}

function closeModal() {
  document.getElementById("editModal").classList.remove("active");
}

function saveEdit() {
  const id = parseInt(document.getElementById("edit-id").value);
  const title = document.getElementById("edit-title").value;
  const metaTitle = document.getElementById("edit-metaTitle").value;
  const description = document.getElementById("edit-description").value;
  const status = document.getElementById("edit-status").value;

  const index = mockData.findIndex((d) => d.id === id);
  if (index !== -1) {
    mockData[index].title = title;
    mockData[index].metaTitle = metaTitle;
    mockData[index].description = description;
    mockData[index].status = status;

    // Cập nhật ngày "Ngày cập nhật"
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    mockData[index].updatedAt = `${dd}/${mm}/${yyyy}`;
  }

  closeModal();
  fetchContent();
}

// Modal Content Functions
function openContentModal(id) {
  const item = mockData.find((d) => d.id === id);
  if (!item) return;

  document.getElementById("content-id").value = item.id;
  document.getElementById("paste-content").value = item.actualContent || "";
  document.getElementById("contentModal").classList.add("active");
}

function closeContentModal() {
  document.getElementById("contentModal").classList.remove("active");
}

function saveContent() {
  const id = parseInt(document.getElementById("content-id").value);
  const contentText = document.getElementById("paste-content").value;

  const index = mockData.findIndex((d) => d.id === id);
  if (index !== -1) {
    mockData[index].actualContent = contentText;
    mockData[index].hasContent = contentText.trim().length > 0;

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    mockData[index].updatedAt = `${dd}/${mm}/${yyyy}`;
  }

  closeContentModal();
  fetchContent();
}
