import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, filename: string = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    // Clone element temporarily for high-res clean capture
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x high DPI resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Standard A4 width in px at 96 DPI
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const a4WidthMm = 210;
    const a4HeightMm = 297;

    // Convert A4 height to canvas pixels
    const pxPerMm = canvas.width / a4WidthMm;
    const pageHeightPx = Math.floor(a4HeightMm * pxPerMm);

    const totalHeight = canvas.height;

    // Find all manual page breaks
    const pageBreakElements = Array.from(element.querySelectorAll('.page-break-before'));
    const parentRect = element.getBoundingClientRect();
    const scaleFactor = canvas.width / element.clientWidth;

    const manualBreakPx = pageBreakElements.map(el => {
      const rect = el.getBoundingClientRect();
      return Math.floor((rect.top - parentRect.top) * scaleFactor);
    }).filter(y => y > 0 && y < totalHeight).sort((a, b) => a - b);

    // Compute slice points based on manual breaks and page size
    const slicePoints: number[] = [0];
    let currentY = 0;

    for (const brk of manualBreakPx) {
      while (brk - currentY > pageHeightPx) {
        currentY += pageHeightPx;
        slicePoints.push(currentY);
      }
      if (brk > currentY) {
        currentY = brk;
        slicePoints.push(currentY);
      }
    }
    while (totalHeight - currentY > pageHeightPx) {
      currentY += pageHeightPx;
      slicePoints.push(currentY);
    }
    if (slicePoints[slicePoints.length - 1] !== totalHeight) {
      slicePoints.push(totalHeight);
    }

    // Slice canvas and add to PDF pages
    let pageCount = 0;
    for (let i = 0; i < slicePoints.length - 1; i++) {
      const yStart = slicePoints[i];
      const yEnd = slicePoints[i + 1];
      const sliceHeight = yEnd - yStart;

      if (sliceHeight <= 5) continue;

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeight;

      const ctx = sliceCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, sliceCanvas.width, sliceHeight);
        ctx.drawImage(canvas, 0, yStart, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
      }

      const imgData = sliceCanvas.toDataURL('image/png', 1.0);
      if (pageCount > 0) {
        pdf.addPage();
      }

      const pdfHeight = (sliceHeight * a4WidthMm) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, a4WidthMm, pdfHeight);
      pageCount++;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const printVectorPDF = () => {
  window.print();
};
