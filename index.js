const { jsPDF } = window.jspdf;

// Initial values for reset
const initialState = {
  header: "STANDUP MEETING",
  managerLabel: "MANAGER:",
  managerValue: "",
  supervisorLabel: "SUPERVISOR:",
  supervisorValue: "",
  dateLabel: "DATE:",
  dateValue: "",
  approveLabel: "APPROVED",
  approveValue: false,
  boxes: [
    { heading: "RAW MATERIALS", notes: "" },
    { heading: "ANNOUNCEMENTS", notes: "" },
    { heading: "STANDARD WORK", notes: "" },
    { heading: "PERFORMANCE", notes: "" },
    { heading: "SAFETY", notes: "" },
    { heading: "SUCCESS STORY", notes: "" },
    { heading: "QUALITY", notes: "" },
    { heading: "ACTION ITEMS", notes: "" },
  ],
};

// Load saved sheets into dropdown
function populateSavedSheets() {
  const select = document.getElementById("loadSheet");
  select.innerHTML = '<option value="">Select Saved Sheet</option>';
  for (let key in localStorage) {
    if (key.startsWith("standupSheet_")) {
      const date = key.replace("standupSheet_", "").replace(/_/g, " ");
      const option = document.createElement("option");
      option.value = key;
      option.text = date;
      select.appendChild(option);
    }
  }
}

// Load specific saved sheet
function loadSavedData(key) {
  if (!key) return;
  const savedData = localStorage.getItem(key);
  if (savedData) {
    const data = JSON.parse(savedData);
    document.querySelector(".header").innerText = data.header;
    document.querySelectorAll(".label")[0].innerText = data.managerLabel;
    document.getElementById("manager").value = data.managerValue;
    document.querySelectorAll(".label")[1].innerText = data.supervisorLabel;
    document.getElementById("supervisor").value = data.supervisorValue;
    document.querySelectorAll(".label")[2].innerText = data.dateLabel;
    document.getElementById("date").value = data.dateValue;
    document.querySelectorAll(".label")[3].innerText = data.approveLabel;
    document.getElementById("approve").checked = data.approveValue;
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    data.boxes.forEach((boxData) => {
      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `
              <h2 contenteditable="true">${boxData.heading}</h2>
              <textarea placeholder="Enter notes here...">${boxData.notes}</textarea>
              <div class="hover-trigger"></div>
              <button class="delete-box">
                <svg viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            `;
      grid.appendChild(box);
    });
    attachDeleteBoxListeners();
  }
}

// Save data to localStorage and refresh
document.getElementById("saveSheet").addEventListener("click", function () {
  const dateValue =
    document.getElementById("date").value ||
    new Date().toISOString().split("T")[0];
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .split(".")[0];
  const key = `standupSheet_${dateValue}_${timestamp}`;
  const data = {
    header: document.querySelector(".header").innerText,
    managerLabel: document.querySelectorAll(".label")[0].innerText,
    managerValue: document.getElementById("manager").value,
    supervisorLabel: document.querySelectorAll(".label")[1].innerText,
    supervisorValue: document.getElementById("supervisor").value,
    dateLabel: document.querySelectorAll(".label")[2].innerText,
    dateValue: document.getElementById("date").value,
    approveLabel: document.querySelectorAll(".label")[3].innerText,
    approveValue: document.getElementById("approve").checked,
    boxes: Array.from(document.querySelectorAll(".box")).map((box) => ({
      heading: box.querySelector("h2").innerText,
      notes: box.querySelector("textarea").value,
    })),
  };
  localStorage.setItem(key, JSON.stringify(data));
  alert("Sheet saved successfully!");
  resetForm();
  populateSavedSheets();
});

// Delete selected sheet
document.getElementById("deleteSheet").addEventListener("click", function () {
  const select = document.getElementById("loadSheet");
  const key = select.value;
  if (key && key.startsWith("standupSheet_")) {
    localStorage.removeItem(key);
    alert("Sheet deleted successfully!");
    populateSavedSheets();
    resetForm();
  } else {
    alert("Please select a sheet to delete.");
  }
});

// Add new box
document.getElementById("addBox").addEventListener("click", function () {
  const grid = document.getElementById("grid");
  const box = document.createElement("div");
  box.className = "box";
  box.innerHTML = `
          <h2 contenteditable="true">NEW SECTION</h2>
          <textarea placeholder="Enter notes here..."></textarea>
          <div class="hover-trigger"></div>
          <button class="delete-box">
            <svg viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        `;
  grid.appendChild(box);
  attachDeleteBoxListeners();
});

// Attach delete box listeners (prevent duplicates)
function attachDeleteBoxListeners() {
  // Select all delete buttons
  const deleteButtons = document.querySelectorAll(".delete-box");
  deleteButtons.forEach((button) => {
    // Remove existing listeners to prevent duplicates
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    // Add new listener
    newButton.addEventListener("click", function () {
      if (document.querySelectorAll(".box").length > 1) {
        this.parentElement.remove();
      } else {
        alert("Cannot delete the last box.");
      }
    });
  });
}

// Toggle delete button visibility on touch devices
document.addEventListener("click", function (event) {
  const trigger = event.target.closest(".hover-trigger");
  if (trigger) {
    const box = trigger.parentElement;
    // Toggle delete-box-visible class
    box.classList.toggle("delete-box-visible");
    // Remove visibility from other boxes
    document.querySelectorAll(".box").forEach((otherBox) => {
      if (otherBox !== box) {
        otherBox.classList.remove("delete-box-visible");
      }
    });
  } else {
    // Hide all delete buttons if clicking outside
    document.querySelectorAll(".box").forEach((box) => {
      box.classList.remove("delete-box-visible");
    });
  }
});

// Reset form to initial state
function resetForm() {
  document.querySelector(".header").innerText = initialState.header;
  document.querySelectorAll(".label")[0].innerText = initialState.managerLabel;
  document.getElementById("manager").value = initialState.managerValue;
  document.querySelectorAll(".label")[1].innerText =
    initialState.supervisorLabel;
  document.getElementById("supervisor").value = initialState.supervisorValue;
  document.querySelectorAll(".label")[2].innerText = initialState.dateLabel;
  document.getElementById("date").value = initialState.dateValue;
  document.querySelectorAll(".label")[3].innerText = initialState.approveLabel;
  document.getElementById("approve").checked = initialState.approveValue;
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  initialState.boxes.forEach((boxData) => {
    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = `
            <h2 contenteditable="true">${boxData.heading}</h2>
            <textarea placeholder="Enter notes here...">${boxData.notes}</textarea>
            <div class="hover-trigger"></div>
            <button class="delete-box">
              <svg viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          `;
    grid.appendChild(box);
  });
  attachDeleteBoxListeners();
  document.getElementById("loadSheet").value = "";
}

// Load sheet on dropdown change
document.getElementById("loadSheet").addEventListener("change", function () {
  loadSavedData(this.value);
});

// Export to PDF with box borders, without buttons or delete icons
document.getElementById("exportPDF").addEventListener("click", function () {
  // Temporarily hide buttons and delete icons
  const style = document.createElement("style");
  style.id = "temp-pdf-style";
  style.innerHTML =
    ".button-container, .delete-box, .hover-trigger { display: none !important; }";
  document.head.appendChild(style);

  html2canvas(document.body, { scale: 2 }).then((canvas) => {
    // Remove temporary style
    document.getElementById("temp-pdf-style").remove();

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter", // U.S. letter size (215.9 x 279.4 mm)
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginLeft = 15; // 15mm left/right margins
    const marginTop = 10; // 10mm top/bottom margins
    const contentWidth = pageWidth - 2 * marginLeft;
    const contentHeight = pageHeight - 2 * marginTop;
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
    const scale = Math.min(
      contentWidth / imgProps.width,
      contentHeight / imgProps.height
    );
    const scaledWidth = imgProps.width * scale;
    const scaledHeight = imgProps.height * scale;
    const x = (pageWidth - scaledWidth) / 2; // Center horizontally
    const y = (pageHeight - scaledHeight) / 2; // Center vertically

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
    pdf.save("standup_meeting.pdf");
  });
});

// Generate static HTML for email (no buttons)
function generateStaticHTML() {
  const header = document.querySelector(".header").innerText;
  const managerLabel = document.querySelectorAll(".label")[0].innerText;
  const managerValue = document.getElementById("manager").value || " ";
  const supervisorLabel = document.querySelectorAll(".label")[1].innerText;
  const supervisorValue = document.getElementById("supervisor").value || " ";
  const dateLabel = document.querySelectorAll(".label")[2].innerText;
  const dateValue = document.getElementById("date").value || " ";
  const approveLabel = document.querySelectorAll(".label")[3].innerText;
  const approveValue = document.getElementById("approve").checked
    ? "Yes"
    : "No";
  const boxes = document.querySelectorAll(".box");
  let boxContents = [];
  boxes.forEach((box) => {
    const heading = box.querySelector("h2").innerText;
    const notes =
      box.querySelector("textarea").value.replace(/\n/g, "<br>") || " ";
    boxContents.push({ heading, notes });
  });

  let staticHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Standup Meeting</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #fff;
      color: #000;
      margin: 5%;
      padding: 0;
    }
    .header {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .names {
      width: 100%;
      max-width: 800px;
      margin: 0 auto 30px auto;
      text-align: center;
    }
    .names-table td {
      padding: 10px;
      font-size: 16px;
    }
    .names-table strong {
      font-weight: bold;
    }
    .grid {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      border-collapse: collapse;
    }
    .box {
      border: 2px solid #000;
      padding: 10px;
      height: 220px;
      vertical-align: top;
      width: 50%;
    }
    .box h2 {
      margin: 0 0 10px 0;
      font-size: 18px;
      border-bottom: 1px solid #000;
      padding-bottom: 5px;
    }
    .box p {
      font-size: 14px;
      margin: 0;
      overflow-y: auto;
      max-height: 160px;
    }
    @media (max-width: 768px) {
      .box {
        display: block;
        width: 100%;
        height: 200px;
      }
      .box p {
        max-height: 140px;
      }
      .names-table td {
        display: block;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="header">${header}</div>
  <table class="names-table" style="width: 100%; max-width: 800px; margin: 0 auto 30px auto;">
    <tr>
      <td>
        <strong>${managerLabel}</strong><br>
        <span>${managerValue}</span>
      </td>
      <td>
        <strong>${supervisorLabel}</strong><br>
        <span>${supervisorValue}</span>
      </td>
      <td>
        <strong>${dateLabel}</strong><br>
        <span>${dateValue}</span>
      </td>
      <td>
        <strong>${approveLabel}</strong><br>
        <span>${approveValue}</span>
      </td>
    </tr>
  </table>
  <table class="grid">
`;

  for (let i = 0; i < boxContents.length; i += 2) {
    staticHTML += `
    <tr>
      <td class="box">
        <h2>${boxContents[i].heading}</h2>
        <p>${boxContents[i].notes}</p>
      </td>
${
  boxContents[i + 1]
    ? `
      <td class="box">
        <h2>${boxContents[i + 1].heading}</h2>
        <p>${boxContents[i + 1].notes}</p>
      </td>
`
    : "<td></td>"
}
    </tr>
`;
  }

  staticHTML += `
  </table>
</body>
</html>`;

  return staticHTML;
}

// Share via Email with PDF attachment (no buttons in PDF)
document.getElementById("shareEmail").addEventListener("click", function () {
  // Generate PDF for attachment
  const style = document.createElement("style");
  style.id = "temp-pdf-style";
  style.innerHTML =
    ".button-container, .delete-box, .hover-trigger { display: none !important; }";
  document.head.appendChild(style);

  html2canvas(document.body, { scale: 2 }).then((canvas) => {
    // Remove temporary style
    document.getElementById("temp-pdf-style").remove();

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter", // U.S. letter size (215.9 x 279.4 mm)
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginLeft = 15; // 15mm left/right margins
    const marginTop = 10; // 10mm top/bottom margins
    const contentWidth = pageWidth - 2 * marginLeft;
    const contentHeight = pageHeight - 2 * marginTop;
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
    const scale = Math.min(
      contentWidth / imgProps.width,
      contentHeight / imgProps.height
    );
    const scaledWidth = imgProps.width * scale;
    const scaledHeight = imgProps.height * scale;
    const x = (pageWidth - scaledWidth) / 2; // Center horizontally
    const y = (pageHeight - scaledHeight) / 2; // Center vertically

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
    const pdfBase64 = pdf.output("datauristring").split(",")[1]; // Get base64 part

    // Generate static HTML for email body
    const staticHTML = generateStaticHTML();
    const subject = encodeURIComponent("Standup Meeting Notes");
    const body = encodeURIComponent(
      "Please find the standup meeting notes attached as a PDF.\n\n" +
        "You can also view the notes in HTML format below:\n\n" +
        staticHTML
    );

    // Create mailto link with PDF attachment
    const mailtoLink = `mailto:?subject=${subject}&body=${body}&attachment=data:application/pdf;base64,${pdfBase64};standup_meeting.pdf`;

    try {
      window.location.href = mailtoLink;
      setTimeout(() => {
        alert(
          "Opening email client with PDF attachment. If the email client does not open or the PDF is not attached, " +
            'please use the "Export to PDF" button to download the PDF and attach it manually, or use the "Generate Shareable Email Version" button to save the HTML version.'
        );
      }, 500);
    } catch (e) {
      alert(
        'Failed to open email client with PDF attachment. Please use the "Export to PDF" button to download the PDF and attach it manually, ' +
          'or use the "Generate Shareable Email Version" button to save the HTML version.'
      );
    }
  });
});

// Preview/Save Email Version
document.getElementById("previewEmail").addEventListener("click", function () {
  const staticHTML = generateStaticHTML();
  const newWindow = window.open();
  newWindow.document.write(staticHTML);
  newWindow.document.close();
  alert(
    "A static version of the template has opened in a new tab. You can save it as an HTML file and attach it to an email, or copy the source code and paste it into your email client's HTML composer."
  );
});

// Initialize delete box listeners
attachDeleteBoxListeners();

// Load saved sheets on page load
window.addEventListener("load", populateSavedSheets);
