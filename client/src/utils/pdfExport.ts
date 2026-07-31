import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

interface CustomSize {
  widthMm: number;
  heightMm: number;
}

const getDimensions = (pageSize: string, customSize?: CustomSize): { widthMm: number; heightMm: number; format: string | number[] } => {
  switch (pageSize) {
    case 'letter':
      return { widthMm: 215.9, heightMm: 279.4, format: 'letter' };
    case 'legal':
      return { widthMm: 215.9, heightMm: 355.6, format: 'legal' };
    case 'executive':
      return { widthMm: 184.1, heightMm: 266.7, format: 'executive' };
    case 'custom': {
      const w = customSize?.widthMm || 210;
      const h = customSize?.heightMm || 297;
      return { widthMm: w, heightMm: h, format: [w, h] };
    }
    case 'a4':
    default:
      return { widthMm: 210, heightMm: 297, format: 'a4' };
  }
};

export const generatePDFBlob = async (
  elementId: string,
  pageSize: string = 'a4',
  customSize?: CustomSize
): Promise<Blob | null> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return null;
  }

  const dim = getDimensions(pageSize, customSize);

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: Math.round(dim.widthMm * 3.7795), // mm to px at 96 DPI
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: dim.format as any,
      compress: true,
    });

    const pageWidthMm = dim.widthMm;
    const pageHeightMm = dim.heightMm;

    // Convert page height to canvas pixels
    const pxPerMm = canvas.width / pageWidthMm;
    const pageHeightPx = Math.floor(pageHeightMm * pxPerMm);

    const totalHeight = canvas.height;

    // Find all manual page breaks
    const pageBreakElements = Array.from(element.querySelectorAll('.page-break-before'));
    const parentRect = element.getBoundingClientRect();
    const scaleFactor = canvas.width / element.clientWidth;

    const manualBreakPx = pageBreakElements.map(el => {
      const rect = el.getBoundingClientRect();
      return Math.floor((rect.top - parentRect.top) * scaleFactor);
    }).filter(y => y > 0 && y < totalHeight).sort((a, b) => a - b);

    // Compute slice points
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
        pdf.addPage(dim.format as any);
      }

      const pdfHeight = (sliceHeight * pageWidthMm) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMm, pdfHeight);
      pageCount++;
    }

    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF Blob:', error);
    return null;
  }
};

export const generatePDF = async (
  elementId: string,
  filename: string = 'resume.pdf',
  pageSize: string = 'a4',
  customSize?: CustomSize
) => {
  const blob = await generatePDFBlob(elementId, pageSize, customSize);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printVectorPDF = () => {
  window.print();
};
