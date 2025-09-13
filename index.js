const { jsPDF } = window.jspdf;

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

const $ = (id) => document.getElementById(id);
const $q = (sel, all) =>
	all ? document.querySelectorAll(sel) : document.querySelector(sel);
const grid = $("grid");

const addDeleteListeners = (event) => {
	const button = event.target.closest(".delete-box");
	if (!button) return;

	const boxes = $q(".box", true);
	const box = button.closest(".box");

	if (boxes.length > 1 && box) {
		box.remove();
		return;
	}

	alert("Cannot delete the last box.");
};
grid.addEventListener("click", addDeleteListeners);

const createBox = ({ heading, notes }) => `
        <div class="box">
          <h2 contenteditable="true">${heading}</h2>
          <textarea placeholder="Enter notes here...">${notes}</textarea>
          <button class="delete-box">
            <svg viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>`;

const populateSavedSheets = () => {
	const select = $("loadSheet");
	select.innerHTML = '<option value="">Select Saved Sheet</option>';
	Object.keys(localStorage)
		.filter((key) => key.startsWith("standupSheet_"))
		.forEach((key) => {
			const option = document.createElement("option");
			option.value = key;
			option.text = key.replace("standupSheet_", "").replace(/_/g, " ");
			select.appendChild(option);
		});
};
const loadSavedData = (key) => {
	if (!key) return;
	const data = JSON.parse(localStorage.getItem(key));
	if (!data) return;
	$q(".header").innerText = data.header;
	const labels = $q(".label", true);
	labels[0].innerText = data.managerLabel;
	$("manager").value = data.managerValue;
	labels[1].innerText = data.supervisorLabel;
	$("supervisor").value = data.supervisorValue;
	labels[2].innerText = data.dateLabel;
	$("date").value = data.dateValue;
	labels[3].innerText = data.approveLabel;
	$("approve").checked = data.approveValue;
	grid.innerHTML = data.boxes.map(createBox).join("");
};

const saveSheet = () => {
	const dateValue = $("date").value || new Date().toISOString().split("T")[0];
	const key = `standupSheet_${dateValue}_${
		new Date().toISOString().replace(/[-:T]/g, "").split(".")[0]
	}`;
	const data = {
		header: $q(".header").innerText,
		managerLabel: $q(".label", true)[0].innerText,
		managerValue: $("manager").value,
		supervisorLabel: $q(".label", true)[1].innerText,
		supervisorValue: $("supervisor").value,
		dateLabel: $q(".label", true)[2].innerText,
		dateValue: $("date").value,
		approveLabel: $q(".label", true)[3].innerText,
		approveValue: $("approve").checked,
		boxes: Array.from($q(".box", true)).map((box) => ({
			heading: box.querySelector("h2").innerText,
			notes: box.querySelector("textarea").value,
		})),
	};
	localStorage.setItem(key, JSON.stringify(data));
	alert("Sheet saved successfully!");
	resetForm();
	populateSavedSheets();
};

const deleteSheet = () => {
	const select = $("loadSheet");
	if (select.value.startsWith("standupSheet_")) {
		localStorage.removeItem(select.value);
		alert("Sheet deleted successfully!");
		populateSavedSheets();
		resetForm();
	} else {
		alert("Please select a sheet to delete.");
	}
};

const addBox = () => {
	grid.insertAdjacentHTML(
		"beforeend",
		createBox({ heading: "NEW SECTION", notes: "" })
	);
};

const resetForm = () => {
	$q(".header").innerText = initialState.header;
	const labels = $q(".label", true);
	labels[0].innerText = initialState.managerLabel;
	$("manager").value = initialState.managerValue;
	labels[1].innerText = initialState.supervisorLabel;
	$("supervisor").value = initialState.supervisorValue;
	labels[2].innerText = initialState.dateLabel;
	$("date").value = initialState.dateValue;
	labels[3].innerText = initialState.approveLabel;
	$("approve").checked = initialState.approveValue;
	grid.innerHTML = initialState.boxes.map(createBox).join("");
	$("loadSheet").value = "";
	grid.addEventListener("click", addDeleteListeners)
};

const exportPDF = () => {
	const style = document.createElement("style");
	style.id = "temp-pdf-style";
	style.innerHTML = `.button-container, .delete-box, .hover-trigger { display: none !important; }
    body {
      width: 1000px !important;
      max-width: 1000px !important;
      margin: 0 auto;     
    }
    .grid {
      grid-template-columns: repeat(2, 1fr);
    `;

	document.head.appendChild(style);
	// html2canvas(document.body, { scale: 2 }).then((canvas) => {
	//   document.getElementById("temp-pdf-style").remove();
	//   const imgData = canvas.toDataURL("image/png");
	//   const pdf = new jsPDF({
	//     orientation: "portrait",
	//     unit: "mm",
	//     format: "letter",
	//   });
	//   const { width: pageWidth, height: pageHeight } = pdf.internal.pageSize;
	//   const marginX = 15,
	//     marginY = 10;
	//   const contentWidth = pageWidth - 2 * marginX;
	//   const contentHeight = pageHeight - 2 * marginY;
	//   const { width, height } = pdf.getImageProperties(imgData);
	//   const scale = Math.min(contentWidth / width, contentHeight / height);
	//   pdf.addImage(
	//     imgData,
	//     "PNG",
	//     (pageWidth - width * scale) / 2,
	//     marginY,
	//     width * scale,
	//     height * scale
	//   );
	//   pdf.save("standup_meeting.pdf");
	// });
	const pdf = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "letter",
	});

	pdf.html(document.body, {
		callback: function (doc) {
			doc.save("standup_meeting.pdf");

			document.head.removeChild(style);
		},
		x: 0,
		y: 0,
		margin: [10, 15, 10, 15],
		width: 180,
		windowWidth: 1000,
	});
};

const generateStaticHTML = () => {
	const header = $q(".header").innerText;
	const labels = $q(".label", true);
	const manager = {
		label: labels[0].innerText,
		value: $("manager").value || " ",
	};
	const supervisor = {
		label: labels[1].innerText,
		value: $("supervisor").value || " ",
	};
	const date = {
		label: labels[2].innerText,
		value: $("date").value || " ",
	};
	const approve = {
		label: labels[3].innerText,
		value: $("approve").checked ? "Yes" : "No",
	};
	const boxes = Array.from($q(".box", true)).map((box) => ({
		heading: box.querySelector("h2").innerText,
		notes: box.querySelector("textarea").value.replace(/\n/g, "<br>") || " ",
	}));
	let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Standup Meeting</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; margin: 20px; padding: 0; }
    .header { text-align: center; font-size: 32px; font-weight: bold; margin: 0 0 20px; line-height: 1.2; }
    .names-table { width: 100%; max-width: 800px; margin: 0 auto 30px; border-collapse: collapse; }
    .names-table td { width: 25%; padding: 10px; font-size: 16px; text-align: left; vertical-align: top; }
    .names-table strong { font-weight: bold; display: block; }
    .grid { width: 100%; max-width: 800px; margin: 0 auto; border-collapse: collapse; }
    .box { border: 2px solid #000; padding: 10px;  vertical-align: top; }
    .box h2 { margin: 0 0 10px; font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; line-height: 1.2; }
    .box p { font-size: 14px; margin: 0; line-height: 1.4; overflow: hidden; max-height: 160px; }
    @media (max-width: 768px) {
      .names-table td, .box { width: 100%; display: block; }
    }
    @media (min-width: 769px) {
      .box { width: 50%; display: inline-block; }
    }
  </style>
</head>
<body>
  <div class="header">${header}</div>
  <table class="names-table">
    <tr>
      <td><strong>${manager.label}</strong><span>${manager.value}</span></td>
      <td><strong>${supervisor.label}</strong><span>${supervisor.value}</span></td>
      <td><strong>${date.label}</strong><span>${date.value}</span></td>
      <td><strong>${approve.label}</strong><span>${approve.value}</span></td>
    </tr>
  </table>
  <table class="grid">`;

	for (let i = 0; i < boxes.length; i += 2) {
		html += `
    <tr>
      <td class="box">
        <h2>${boxes[i].heading}</h2>
        <p>${boxes[i].notes}</p>
      </td>
      ${
				boxes[i + 1]
					? `<td class="box"><h2>${boxes[i + 1].heading}</h2><p>${
							boxes[i + 1].notes
					  }</p></td>`
					: "<td></td>"
			}
    </tr>`;
	}

	html += `</table></body></html>`;
	return html;
};

const shareEmail = () => {
	const style = document.createElement("style");
	style.id = "temp-pdf-style";
	style.innerHTML =
		".button-container, .delete-box, .hover-trigger { display: none !important; }";
	document.head.appendChild(style);
	html2canvas(document.body, { scale: 2 }).then((canvas) => {
		document.getElementById("temp-pdf-style").remove();
		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "letter",
		});
		const { width: pageWidth, height: pageHeight } = pdf.internal.pageSize;
		const marginX = 15,
			marginY = 10;
		const contentWidth = pageWidth - 2 * marginX;
		const contentHeight = pageHeight - 2 * marginY;
		const { width, height } = pdf.getImageProperties(imgData);
		const scale = Math.min(contentWidth / width, contentHeight / height);
		pdf.addImage(
			imgData,
			"PNG",
			(pageWidth - width * scale) / 2,
			(pageHeight - height * scale) / 2,
			width * scale,
			height * scale
		);
		const pdfBase64 = pdf.output("datauristring").split(",")[1];
		const staticHTML = generateStaticHTML();
		const subject = encodeURIComponent("Standup Meeting Notes");
		const body = encodeURIComponent(
			`Please find the standup meeting notes attached as a PDF.\n\nYou can also view the notes in HTML format below:\n\n${staticHTML}`
		);
		try {
			window.location.href = `mailto:?subject=${subject}&body=${body}&attachment=data:application/pdf;base64,${pdfBase64};standup_meeting.pdf`;
			setTimeout(
				() =>
					alert(
						"Opening email client with PDF attachment. If the email client does not open or the PDF is not attached, " +
							'please use the "Export to PDF" button to download the PDF and attach it manually, or use the "Generate Shareable Email Version" button to save the HTML version.'
					),
				500
			);
		} catch {
			alert(
				'Failed to open email client with PDF attachment. Please use the "Export to PDF" button to download the PDF and attach it manually, ' +
					'or use the "Generate Shareable Email Version" button to save the HTML version.'
			);
		}
	});
};

/* const previewEmail = () => {
	const newWindow = window.open();
	newWindow.document.write(generateStaticHTML());
	newWindow.document.close();
	alert(
		"A static version of the template has opened in a new tab. You can save it as an HTML file or copy the source code into your email client's HTML composer."
	);
} */;
$("saveSheet").addEventListener("click", saveSheet);
$("deleteSheet").addEventListener("click", deleteSheet);
$("addBox").addEventListener("click", addBox);
$("exportPDF").addEventListener("click", exportPDF);
$("loadSheet").addEventListener("change", (e) => loadSavedData(e.target.value));
populateSavedSheets()
