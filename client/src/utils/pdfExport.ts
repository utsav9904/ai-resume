import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, filename: string = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const a4Width = 210;
    
    // Scale factor to map element pixels to canvas pixels
    const scale = canvas.width / element.clientWidth;
    const a4HeightPx = element.clientWidth * 1.414 * scale;

    // Find all page breaks
    const pageBreakElements = Array.from(element.querySelectorAll('.page-break-before'));
    const manualBreaks = pageBreakElements.map(el => {
      const rect = el.getBoundingClientRect();
      const parentRect = element.getBoundingClientRect();
      return (rect.top - parentRect.top) * scale;
    }).filter(y => y > 0 && y < canvas.height).sort((a, b) => a - b);

    // We will slice the canvas at these Y positions.
    const slicePoints: number[] = [0];
    
    let currentY = 0;
    for (const brk of manualBreaks) {
      while (brk - currentY > a4HeightPx) {
        currentY += a4HeightPx;
        slicePoints.push(currentY);
      }
      currentY = brk;
      slicePoints.push(currentY);
    }
    while (canvas.height - currentY > a4HeightPx) {
      currentY += a4HeightPx;
      slicePoints.push(currentY);
    }
    slicePoints.push(canvas.height);

    // Slice and add pages to PDF
    let pageCount = 0;
    for (let i = 0; i < slicePoints.length - 1; i++) {
      const yStart = slicePoints[i];
      const yEnd = slicePoints[i + 1];
      const sliceHeight = yEnd - yStart;

      if (sliceHeight <= 10) continue; // Skip tiny slices

      // Create a slice canvas
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeight;
      const ctx = sliceCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, yStart, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
      }

      const sliceData = sliceCanvas.toDataURL('image/png');

      if (pageCount > 0) {
        pdf.addPage();
      }

      const pdfHeight = (sliceHeight * a4Width) / canvas.width;
      pdf.addImage(sliceData, 'PNG', 0, 0, a4Width, pdfHeight);
      pageCount++;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
