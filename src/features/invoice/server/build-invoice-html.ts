import type { InvoiceConfig } from "@/features/invoice/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { INVOICE_CSS } from "@/features/invoice/server/invoice-styles";

function getLessonDurationHours(lesson: InvoiceConfig["lessons"][0]): number {
  const startTime = new Date(lesson.start).getTime();
  const endTime = new Date(lesson.end).getTime();
  const durationMs = endTime - startTime;
  const durationHours = durationMs / (1000 * 60 * 60);
  return durationHours > 0 ? durationHours : 0;
}

function getLessonHourlyRate(lesson: InvoiceConfig["lessons"][0]): number {
  return lesson.price ?? 0;
}

function getLessonTotal(lesson: InvoiceConfig["lessons"][0]): number {
  const hours = getLessonDurationHours(lesson);
  const rate = getLessonHourlyRate(lesson);
  return hours * rate;
}

export function buildInvoiceHtml(config: InvoiceConfig) {
  const { startDate, endDate, lessons, students, selectedStudentIds } = config;

  const selectedStudents = students.filter((s) => selectedStudentIds.includes(s.id));

  const lessonsByStudent = new Map<string, typeof lessons>();
  selectedStudents.forEach((student) => {
    const studentLessons = lessons.filter((lesson) => lesson.studentId === student.id);
    lessonsByStudent.set(student.id, studentLessons);
  });

  const studentTotals = selectedStudents.map((student) => {
    const studentLessons = lessonsByStudent.get(student.id) ?? [];
    const total = studentLessons.reduce((sum, lesson) => sum + getLessonTotal(lesson), 0);
    return { student, total };
  });

  const grandTotal = studentTotals.reduce((sum, entry) => sum + entry.total, 0);

  const formattedStart = format(new Date(startDate), "dd MMM yyyy", { locale: fr });
  const formattedEnd = format(new Date(endDate), "dd MMM yyyy", { locale: fr });

  const rowsHtml = lessons
    .filter((lesson) => selectedStudentIds.includes(lesson.studentId))
    .map((lesson) => {
      const student = students.find((s) => s.id === lesson.studentId);
      const dateLabel = format(new Date(lesson.start), "dd/MM/yyyy HH:mm", { locale: fr });
      const hours = getLessonDurationHours(lesson);
      const hourlyRate = getLessonHourlyRate(lesson);
      const total = getLessonTotal(lesson);

      const hoursLabel = hours.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const hourlyRateLabel = hourlyRate
        ? hourlyRate.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
        : "-";

      const totalLabel = total
        ? total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
        : "-";

      return `
        <tr>
          <td class="cell date">${dateLabel}</td>
          <td class="cell">${student ? `${student.firstName} ${student.lastName}` : "-"}</td>
          <td class="cell title">${lesson.title || "Lesson"}</td>
          <td class="cell amount" style="text-align: right;">${hoursLabel}</td>
          <td class="cell amount" style="text-align: right;">${hourlyRateLabel}</td>
          <td class="cell amount" style="text-align: right;">${totalLabel}</td>
        </tr>
      `;
    })
    .join("\n");

  const summaryChips = studentTotals
    .map(({ student, total }) => {
      const totalLabel = total.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
      return `
        <div class="chip">
          <span>${student.firstName} ${student.lastName}</span>
          <span class="chip-amount">${totalLabel}</span>
        </div>
      `;
    })
    .join("\n");

  const grandTotalLabel = grandTotal.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <title>Invoice</title>
    <style>${INVOICE_CSS}</style>
  </head>
  <body>
    <div class="invoice">
      <!-- Issuer and client header -->
      <div class="header">
        <div class="header-left">
          <div class="issuer-name">Mohamed-Nour Eljadiri</div>
          <div class="issuer-line">Siret : 93210872300010</div>
          <div class="issuer-line">Adresse postale : 34 Rue Antoine Charial</div>
          <div class="issuer-line">Code postal, Ville : 69003, Lyon</div>
          <div class="issuer-line">Téléphone : 07 49 49 43 03</div>
        </div>
        <div class="header-right">
          <div>
            <div class="section-label">Détails de la facture</div>
            <div class="meta-row">
              <div>
                <div class="meta-value">DATE : 1 décembre 2025</div>
              </div>
              <div>
                <div class="meta-value">N° FACTURE 102</div>
              </div>
            </div>
            <div class="meta-value">POUR : Cours particuliers</div>
          </div>
          <div>
            <div class="section-label">FACTURER À</div>
            <div class="meta-value">Nom : Mathilde SALINAS</div>
            <div class="meta-value">Nom société : COURS DES POSSIBLES</div>
            <div class="meta-value">Adresse postale : 10 B Rue Jangot</div>
            <div class="meta-value">Code postal, Ville : 69007, Lyon</div>
            <div class="meta-value">Téléphone : 07 81 81 52 18</div>
          </div>
        </div>
      </div>

      <!-- Invoice title & period / total summary -->
      <div class="invoice-title-row">
        <div>
          <div class="title">Facture</div>
          <div class="subtitle">Leçons du ${formattedStart} au ${formattedEnd}</div>
        </div>
        <div style="text-align: right;">
          <div class="total-label">Total dû</div>
          <div class="total-value">${grandTotalLabel}</div>
          <div class="badge">
            ${selectedStudents.length} ${selectedStudents.length === 1 ? "élève" : "élèves"}
          </div>
        </div>
      </div>

      <div class="summary">
        <div class="summary-title">Récapitulatif par élève</div>
        <div class="chips">
          ${summaryChips}
        </div>
      </div>

      <div class="content">
        <table>
          <thead>
            <tr>
              <th style="width: 120px;">Date</th>
              <th style="width: 160px;">Élève</th>
              <th>Intitulé</th>
              <th style="width: 80px; text-align: right;">Heures</th>
              <th style="width: 120px; text-align: right;">Taux horaire</th>
              <th style="width: 120px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="label">Total dû</td>
              <td class="value">${grandTotalLabel}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </body>
</html>
`;
}
