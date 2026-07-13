import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    grade: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    githubLink: string;
  }>;
  certifications: Array<{
    name: string;
    organization: string;
    date: string;
  }>;
  template: string;
  templateColor: string;
  customization?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    pagePadding?: string;
    sectionSpacing?: string;
    itemSpacing?: string;
    headingStyle?: string;
    layout?: string;
    sectionOrder?: string[];
    sidebarSections?: string[];
    mainSections?: string[];
    columnRatio?: string;
    accentColor?: string;
    textColor?: string;
    bgColor?: string;
    showIcons?: boolean;
    showDates?: boolean;
  };
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Resume' },
    personalInfo: {
      fullName: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
    },
    summary: { type: String },
    education: [
      {
        school: { type: String },
        degree: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        grade: { type: String },
      },
    ],
    experience: [
      {
        company: { type: String },
        position: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
      },
    ],
    skills: {
      technical: [{ type: String }],
      soft: [{ type: String }],
      languages: [{ type: String }],
    },
    projects: [
      {
        name: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        githubLink: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String },
        organization: { type: String },
        date: { type: String },
      },
    ],
    template: { type: String, default: 'modern' },
    templateColor: { type: String, default: '#0d9488' },
    customization: {
      fontFamily: { type: String, default: 'inter' },
      fontSize: { type: String, default: 'sm' },
      lineHeight: { type: String, default: 'normal' },
      pagePadding: { type: String, default: 'normal' },
      sectionSpacing: { type: String, default: 'normal' },
      itemSpacing: { type: String, default: 'normal' },
      headingStyle: { type: String, default: 'default' },
      layout: { type: String, default: '1-column' },
      sectionOrder: [{ type: String }],
      sidebarSections: [{ type: String }],
      mainSections: [{ type: String }],
      columnRatio: { type: String, default: '1/3-2/3' },
      accentColor: { type: String, default: '#0d9488' },
      textColor: { type: String, default: '#1f2937' },
      bgColor: { type: String, default: '#ffffff' },
      showIcons: { type: Boolean, default: true },
      showDates: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
