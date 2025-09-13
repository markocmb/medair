Standup Meeting Template

A web-based application for creating, saving, and sharing standup meeting notes with a responsive layout, PDF export, and email sharing capabilities.

Features

Editable Fields: Customize header, manager/supervisor/date/approve labels, and box headings/notes.

Dynamic Boxes: Add/delete boxes (minimum 1 box). Trash can icons (24x24px, red, 16x16px white SVG) appear on hover/tap.

Save/Load/Delete Sheets: Store sheets in localStorage, load via dropdown, delete selected sheets.

PDF Export: U.S. letter size (215.9 x 279.4 mm), 15mm left/right and 10mm top/bottom margins, 2px solid black box borders, no buttons/icons.

Email Sharing: Share via mailto: with PDF attachment and HTML body (2px box borders, no buttons/icons). Fallback to manual attachment.

Responsive Design: Mobile (≤768px: single-column grid), iPad (769px–1024px: two-column grid), desktop (multi-column grid).

Email-Compatible HTML: Table-based layout, fixed font sizes (32px header, 16px names, 18px box headings, 14px box notes), mobile stacking.

Directory Structure

├── index.html # Main HTML file
├── pages/
│ ├── index.js # JavaScript logic (~150 lines)
│ ├── index.css # CSS styles (~100 lines)

Setup

Clone or Download:

Place index.html, pages/index.js, and pages/index.css in a project directory.

Serve Locally:

Use a local server due to <script type="module"> CORS restrictions:

npx http-server

Open http://localhost:8080 in a browser.

Dependencies:

No local installation required; uses CDN-hosted jsPDF (2.5.1) and html2canvas (1.4.1).

Usage

Webpage:

Edit the header (STANDUP MEETING), labels (MANAGER:, SUPERVISOR:, DATE:, APPROVED), inputs, checkbox, and box headings/notes.

Hover/tap top-right 30x30px area (.hover-trigger) to show 24x24px red trash can (.delete-box) with 16x16px white SVG; click to delete box (if >1 box).

Use buttons:

Save Sheet: Save current state to localStorage with key standupSheet*<date>*<timestamp>.

Load Sheet: Select saved sheet from dropdown to load.

Delete Sheet: Delete selected sheet from localStorage (shows alert if none selected).

Add Box: Add a new box (NEW SECTION).

Export to PDF: Download PDF with 2px box borders, no buttons/icons.

Share via Email: Open email client with PDF attachment and HTML body.

Generate Shareable Email Version: Open static HTML in new tab for saving/copying.

PDF:

U.S. letter size, 15mm margins, 2px solid black box borders, no buttons (.button-container), no trash can icons (.delete-box), no hover triggers (.hover-trigger).

Email:

Sends via mailto: with PDF attachment and HTML body (2px box borders, no buttons/icons).

If mailto: fails (e.g., due to size limits), manually attach PDF or copy HTML from preview.

Testing

Webpage:

Test on desktop, mobile (≤768px), iPad (769px–1024px).

Verify responsive grid, hover/tap trash can icons, save/load/delete sheets, add/delete boxes, editable fields, approve checkbox.

Check edge cases: deleting last box (shows alert('Cannot delete the last box.')), long text in boxes, empty fields.

PDF:

Verify in Adobe Acrobat: U.S. letter size, 15mm margins, 2px box borders, no buttons/icons, centered content.

Email:

Outlook: HTML body (2px box borders, no buttons, stacked on mobile, four-column names/two-column boxes on desktop). Check PDF attachment.

Gmail/Yahoo: Verify HTML body; manually attach PDF if needed.

Teams: Email to channel or upload PDF manually. Test HTML in Teams email/chat.

Notes

Limitations:

Requires local server for <script type="module"> due to CORS. Alternatively, use inline <script> or non-module CDN imports.

mailto: may fail for large PDFs/HTML (>~2000 characters); use manual attachment (alert provided).

Microsoft Teams: No direct mailto: to chats; use channel email or manual upload.

html2canvas: Slight PDF rendering differences (e.g., font alignment); adjust scale: 2 if needed.

Enhancements:

Format dropdown dates (e.g., “Sep 13, 2025, 7:06 AM”).

Add lined textarea background in index.css.

Use server-side storage/email (e.g., Node.js, SendGrid) to bypass mailto: limits.

Move to inline <script> if external files cause issues.

License

MIT License. Feel free to use and modify as needed.
