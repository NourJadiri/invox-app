export const INVOICE_CSS = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 12px;
  color: #020817;
  background-color: #ffffff;
  padding: 0;
  margin: 0;
}
.invoice {
  width: 100%;
  max-width: 100%;
  margin: 0;
  background: #ffffff;
  border: none;
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
}
.header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 24px 12px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.header-left {
  flex: 1;
}
.header-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
}
.issuer-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}
.issuer-line {
  font-size: 11px;
  color: #4b5563;
}
.section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 2px;
}
.meta-value {
  font-size: 11px;
  color: #111827;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.meta-row > div {
  flex: 1;
}
.invoice-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 24px 12px 24px;
}
.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
}
.subtitle {
  font-size: 12px;
  color: #6b7280;
}
.total-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}
.total-value {
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
}
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  background: #f3f4ff;
  color: #4338ca;
  margin-top: 4px;
}
.summary {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}
.summary-title {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 10px;
}
.chip-amount {
  font-weight: 600;
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
thead {
  background: #f9fafb;
}
th {
  text-align: left;
  padding: 8px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}
.cell {
  padding: 8px 10px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 11px;
  vertical-align: top;
}
.cell.date {
  white-space: nowrap;
}
.cell.title {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cell.amount {
  text-align: right;
  white-space: nowrap;
}
tfoot td {
  padding: 8px 10px;
  font-weight: 600;
  border-top: 1px solid #e5e7eb;
}
tfoot .label {
  text-align: right;
}
tfoot .value {
  text-align: right;
}
.content {
  padding: 16px 20px 20px 20px;
}
.student-header {
  background: #f3f4f6;
}
.student-header td {
  border-bottom: 1px solid #e5e7eb;
}
.student-name {
  font-size: 12px;
  font-weight: 600;
  color: #4338ca;
  padding: 10px 10px;
}
.student-subtotal {
  border-bottom: 2px solid #e5e7eb;
}
.student-subtotal td {
  padding-top: 6px;
  padding-bottom: 10px;
}
`;
