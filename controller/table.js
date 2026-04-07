let datetable = [
  {
    id: 1,
    projectId: "project1",
    title: "Dự án Xây dựng Website",
    metaTitle: "Xây dựng Website - Trang web đẹp...",
    description: "Mô tả ngắn gọn về quá trình xây dựng...",
    hasContent: false,
    createdAt: "2026-04-01",
    status: "done",
    updatedAt: "05/04/2026",
  },
  {
    id: 2,
    projectId: "project2",
    title: "Báo cáo Tài chính",
    metaTitle: "Báo cáo Tài chính - Phân tích chi tiết...",
    description: "Báo cáo chi tiết về tình hình tài chính của công ty...",
    hasContent: false,
    createdAt: "2026-03-15",
    status: "partial",
    updatedAt: "20/03/2026",
  },
];

const redertable = (data) => {
  const tableBody = document.getElementById("table");

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.projectId}</td>
        <td>${item.title}</td>
        <td>${item.metaTitle}</td>
        <td>${item.description}</td>
        <td>${item.hasContent}</td>
        <td>${item.createdAt}</td>
        <td>${item.status}</td>
        <td>${item.updatedAt}</td>
      `;
    tableBody.appendChild(row);
  });
};

redertable(datetable);
