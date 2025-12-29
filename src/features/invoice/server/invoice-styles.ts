export const INVOICE_CSS = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  font-size: 11px;
  color: #000;
  background-color: #fff;
  line-height: 1.3;
}

.invoice {
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  padding: 15mm; /* Moderate padding to maximize space */
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.header-left .issuer-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}
.issuer-line {
  font-size: 11px;
  color: #333;
}

.header-right {
  text-align: right;
  font-size: 11px;
}

.section-label {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 9px;
  color: #666;
  margin-top: 8px;
  margin-bottom: 2px;
}
.section-label:first-child { margin-top: 0; }

.meta-value {
  font-weight: bold;
}

/* Title Row */
.invoice-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}
.subtitle {
  font-size: 11px;
  color: #555;
}

.total-block {
  text-align: right;
}
.total-label {
  font-size: 10px;
  text-transform: uppercase;
  color: #666;
}
.total-value {
  font-size: 18px;
  font-weight: bold;
}

/* Summary Chips (keep them small) */
.summary {
  margin-bottom: 15px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}
.summary-title {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 10px;
  text-transform: uppercase;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  background: white;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 10px;
}
.chip span:first-child { color: #555; margin-right: 4px; }
.chip-amount { font-weight: bold; }

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  border-bottom: 2px solid #000;
  padding: 4px 6px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
}

td {
  padding: 4px 6px;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.student-header td {
  background-color: #f0f0f0;
  font-weight: bold;
  padding-top: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #ccc;
}
.student-subtotal td {
  border-bottom: 2px solid #ccc;
  font-weight: bold;
  background-color: #fafafa;
}

/* Alignments */
.text-right { text-align: right; }
.text-left { text-align: left; }

/* Column Widths (Adjusted for compactness) */
.col-date { width: 15%; }
.col-title { width: 45%; }
.col-hours { width: 10%; text-align: right; }
.col-rate { width: 15%; text-align: right; }
.col-total { width: 15%; text-align: right; }

tfoot td {
  padding-top: 10px;
  font-size: 14px;
  font-weight: bold;
  border-top: 2px solid #000;
}

.footer {
  margin-top: 30px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
  font-size: 9px;
  color: #555;
  text-align: center;
}
.footer p {
  margin: 2px 0;
}
`;
