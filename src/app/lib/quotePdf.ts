import { jsPDF } from 'jspdf';
import type { CalculatorData } from '../App';
import { computeTotals, formatLKR } from './calculations';

const ORANGE: [number, number, number] = [237, 148, 32];
const INK: [number, number, number] = [45, 55, 72];
const MUTED: [number, number, number] = [113, 128, 150];
const LIGHT_BG: [number, number, number] = [247, 250, 252];

const ROOM_LABELS: { key: string; label: string }[] = [
  { key: 'livingAreas', label: 'Living' },
  { key: 'diningAreas', label: 'Dining' },
  { key: 'pantries', label: 'Pantry' },
  { key: 'kitchens', label: 'Kitchen' },
  { key: 'parkings', label: 'Parking' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'bathrooms', label: 'Bathrooms' },
];

const FLOOR_NAMES = ['Ground Floor', 'First Floor', 'Second Floor'];

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...ORANGE);
  doc.text(title.toUpperCase(), 15, y);
  doc.setDrawColor(...ORANGE);
  doc.setLineWidth(0.6);
  doc.line(15, y + 2, 195, y + 2);
  return y + 10;
}

function kvRow(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  opts: { bold?: boolean; fill?: boolean } = {}
): number {
  if (opts.fill) {
    doc.setFillColor(...LIGHT_BG);
    doc.rect(15, y - 5, 180, 8, 'F');
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(label, 18, y);
  doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
  doc.setTextColor(...INK);
  const lines = doc.splitTextToSize(value, 95);
  doc.text(lines, 100, y);
  return y + 4 + (lines.length - 1) * 5 + 4;
}

export function downloadQuotePdf(data: CalculatorData, quoteId: string) {
  const t = computeTotals(data);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const today = new Date().toLocaleDateString('en-GB');

  // Header band
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Bismark Lanka Engineering', 15, 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('House Building Cost Estimate', 15, 20);
  doc.setFontSize(9);
  doc.text(`Quote: ${quoteId.slice(0, 8)}   |   Date: ${today}`, 195, 13, { align: 'right' });
  doc.text('bismarklanka.lk  |  +94 77 779 3790  |  info@bismarklanka.lk', 195, 20, {
    align: 'right',
  });

  let y = 40;

  // Total banner
  doc.setFillColor(...INK);
  doc.roundedRect(15, y, 180, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Total Estimated Budget', 22, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(formatLKR(t.totalCost), 22, y + 15);
  y += 28;

  y = sectionTitle(doc, 'Customer Information', y);
  y = kvRow(doc, 'Full Name', data.user.fullName || '-', y, { fill: true });
  y = kvRow(doc, 'Phone', data.user.phone || '-', y);
  y = kvRow(doc, 'Email', data.user.email || '-', y, { fill: true });
  y = kvRow(doc, 'Location', data.user.location || '-', y);
  y += 4;

  y = sectionTitle(doc, 'Land Details', y);
  y = kvRow(doc, 'Land Size', `${data.perches} Perches`, y, { fill: true });
  y = kvRow(doc, 'Total Land Area', `${Math.round(t.totalLandSqft).toLocaleString()} sqft`, y);
  y = kvRow(doc, 'Buildable Area (60%)', `${Math.round(t.usableLandSqft).toLocaleString()} sqft`, y, {
    fill: true,
  });
  y += 4;

  y = sectionTitle(doc, 'House Details', y);
  y = kvRow(doc, 'Stories', String(data.stories), y, { fill: true });
  data.floors.forEach((floor, i) => {
    const parts = ROOM_LABELS.map(({ key, label }) => {
      const n = (floor as unknown as Record<string, number>)[key] ?? 0;
      return n > 0 ? `${n} ${label}` : null;
    }).filter(Boolean);
    y = kvRow(doc, FLOOR_NAMES[i] ?? `Floor ${i + 1}`, parts.length > 0 ? parts.join(', ') : '-', y, {
      fill: i % 2 === 0,
    });
  });
  y = kvRow(doc, 'Total Area', `${Math.round(t.totalSqft).toLocaleString()} sqft`, y);
  y += 4;

  y = sectionTitle(doc, 'Cost Breakdown', y);
  y = kvRow(doc, 'Construction Cost', formatLKR(t.constructionCost), y, { fill: true });
  y = kvRow(doc, `Roof (${t.roofName})`, formatLKR(t.roofCost), y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text('Total Estimated Cost', 18, y + 2);
  doc.setTextColor(...ORANGE);
  doc.text(formatLKR(t.totalCost), 195, y + 2, { align: 'right' });
  y += 12;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    'This is a computer-generated estimate for planning purposes. Final pricing will be confirmed after site inspection.',
    15,
    287
  );

  const safeName = (data.user.fullName || 'quote').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  doc.save(`Bismark-Quote-${safeName}-${today.replace(/\//g, '-')}.pdf`);
}
