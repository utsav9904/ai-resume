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
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
