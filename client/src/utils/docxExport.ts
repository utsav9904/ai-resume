import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import type { ResumeState } from '../store/useResumeStore';

const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToDocx = async (data: ResumeState, filename: string = 'resume.docx') => {
  const { summary, experience, education, skills, projects, certifications, templateColor } = data;
  const personalInfo = data.personalInfo || {};

  const primaryColor = templateColor ? templateColor.replace('#', '') : '0D9488';

  const children: Paragraph[] = [];

  // Name Header
  if (personalInfo.fullName) {
    children.push(
      new Paragraph({
        text: personalInfo.fullName.toUpperCase(),
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );
  }

  // Contact Info Line
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.address) contactParts.push(personalInfo.address);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.github) contactParts.push(personalInfo.github);
  if (personalInfo.portfolio) contactParts.push(personalInfo.portfolio);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 20, // 10pt
            color: '555555',
          }),
        ],
      })
    );
  }

  // Helper for Section Headings
  const addSectionHeading = (title: string) => {
    children.push(
      new Paragraph({
        text: title.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: primaryColor,
            space: 4,
            style: 'single' as any,
            size: 12,
          },
        },
      })
    );
  };

  // Professional Summary
  if (summary) {
    addSectionHeading('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: summary, size: 22 })],
      })
    );
  }

  // Work Experience
  if (experience && experience.length > 0) {
    addSectionHeading('Work Experience');
    experience.forEach(exp => {
      if (exp.position || exp.company) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({ text: exp.position || 'Position', bold: true, size: 22 }),
              new TextRun({ text: exp.company ? `  —  ${exp.company}` : '', size: 22, color: '444444' }),
              new TextRun({
                text: (exp.startDate || exp.endDate) ? `   (${exp.startDate || ''} - ${exp.endDate || ''})` : '',
                italics: true,
                size: 20,
                color: primaryColor,
              }),
            ],
          })
        );
      }
      if (exp.description) {
        children.push(
          new Paragraph({
            spacing: { after: 160 },
            children: [new TextRun({ text: exp.description, size: 20 })],
          })
        );
      }
    });
  }

  // Education
  if (education && education.length > 0) {
    addSectionHeading('Education');
    education.forEach(edu => {
      if (edu.degree || edu.school) {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 80 },
            children: [
              new TextRun({ text: edu.degree || 'Degree', bold: true, size: 22 }),
              new TextRun({ text: edu.school ? `  —  ${edu.school}` : '', size: 22 }),
              new TextRun({
                text: (edu.startDate || edu.endDate) ? `   (${edu.startDate || ''} - ${edu.endDate || ''})` : '',
                italics: true,
                size: 20,
                color: primaryColor,
              }),
              new TextRun({ text: edu.grade ? `  |  Grade: ${edu.grade}` : '', size: 20 }),
            ],
          })
        );
      }
    });
  }

  // Skills
  const hasTech = skills?.technical && skills.technical.some(s => s);
  const hasSoft = skills?.soft && skills.soft.some(s => s);
  const hasLang = skills?.languages && skills.languages.some(s => s);

  if (hasTech || hasSoft || hasLang) {
    addSectionHeading('Skills');
    if (hasTech) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Technical Skills: ', bold: true, size: 20 }),
            new TextRun({ text: skills.technical.filter(Boolean).join(', '), size: 20 }),
          ],
        })
      );
    }
    if (hasSoft) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Soft Skills: ', bold: true, size: 20 }),
            new TextRun({ text: skills.soft.filter(Boolean).join(', '), size: 20 }),
          ],
        })
      );
    }
    if (hasLang) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: 'Languages: ', bold: true, size: 20 }),
            new TextRun({ text: skills.languages.filter(Boolean).join(', '), size: 20 }),
          ],
        })
      );
    }
  }

  // Projects
  if (projects && projects.length > 0) {
    addSectionHeading('Projects');
    projects.forEach(proj => {
      if (proj.name) {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: proj.name, bold: true, size: 22 }),
              new TextRun({ text: proj.technologies ? ` (${proj.technologies})` : '', italics: true, size: 20, color: '666666' }),
              new TextRun({ text: proj.githubLink ? ` — ${proj.githubLink}` : '', size: 20, color: primaryColor }),
            ],
          })
        );
      }
      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 140 },
            children: [new TextRun({ text: proj.description, size: 20 })],
          })
        );
      }
    });
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    addSectionHeading('Certifications');
    certifications.forEach(cert => {
      if (cert.name) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: cert.name, bold: true, size: 20 }),
              new TextRun({ text: cert.organization ? ` — ${cert.organization}` : '', size: 20 }),
              new TextRun({ text: cert.date ? ` (${cert.date})` : '', italics: true, size: 20, color: primaryColor }),
            ],
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveBlob(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
};

export const exportToTxt = (data: ResumeState, filename: string = 'resume.txt') => {
  const { summary, experience, education, skills, projects, certifications } = data;
  const personalInfo = data.personalInfo || {};
  let text = `${(personalInfo.fullName || 'RESUME').toUpperCase()}\n`;
  text += `${'='.repeat(40)}\n`;
  if (personalInfo.email) text += `Email: ${personalInfo.email}\n`;
  if (personalInfo.phone) text += `Phone: ${personalInfo.phone}\n`;
  if (personalInfo.address) text += `Location: ${personalInfo.address}\n`;
  if (personalInfo.linkedin) text += `LinkedIn: ${personalInfo.linkedin}\n`;
  if (personalInfo.github) text += `GitHub: ${personalInfo.github}\n`;
  if (personalInfo.portfolio) text += `Portfolio: ${personalInfo.portfolio}\n`;
  text += `\n`;

  if (summary) {
    text += `SUMMARY\n${'-'.repeat(30)}\n${summary}\n\n`;
  }

  if (experience?.length) {
    text += `EXPERIENCE\n${'-'.repeat(30)}\n`;
    experience.forEach(exp => {
      text += `${exp.position || 'Position'} | ${exp.company || 'Company'} (${exp.startDate || ''} - ${exp.endDate || ''})\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += `\n`;
    });
  }

  if (education?.length) {
    text += `EDUCATION\n${'-'.repeat(30)}\n`;
    education.forEach(edu => {
      text += `${edu.degree || 'Degree'} | ${edu.school || 'School'} (${edu.startDate || ''} - ${edu.endDate || ''})\n`;
      if (edu.grade) text += `Grade: ${edu.grade}\n`;
      text += `\n`;
    });
  }

  if (skills) {
    text += `SKILLS\n${'-'.repeat(30)}\n`;
    if (skills.technical?.length) text += `Technical: ${skills.technical.join(', ')}\n`;
    if (skills.soft?.length) text += `Soft: ${skills.soft.join(', ')}\n`;
    if (skills.languages?.length) text += `Languages: ${skills.languages.join(', ')}\n`;
    text += `\n`;
  }

  if (projects?.length) {
    text += `PROJECTS\n${'-'.repeat(30)}\n`;
    projects.forEach(p => {
      text += `${p.name} (${p.technologies || ''})\n${p.description || ''}\n${p.githubLink || ''}\n\n`;
    });
  }

  if (certifications?.length) {
    text += `CERTIFICATIONS\n${'-'.repeat(30)}\n`;
    certifications.forEach(c => {
      text += `${c.name} - ${c.organization || ''} (${c.date || ''})\n`;
    });
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  saveBlob(blob, filename.endsWith('.txt') ? filename : `${filename}.txt`);
};

export const exportToJson = (data: ResumeState, filename: string = 'resume-backup.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  saveBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
};
