import React from 'react';

export type ResumeData = {
  name: string;
  contact: { email: string; phone: string; linkedin: string; github: string };
  summary: string;
  skills: string[];
  experience: { title: string; company: string; duration: string; bullets: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  projects: { name: string; description: string; technologies: string }[];
};

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

const EditableText = ({ value, onChange, style, tagName = 'div' }: { value: string, onChange: (val: string) => void, style?: React.CSSProperties, tagName?: keyof JSX.IntrinsicElements }) => {
  const Tag = tagName as any;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => onChange(e.currentTarget.innerText)}
      style={{ ...style, outline: 'none', padding: '2px', border: '1px solid transparent', borderRadius: '4px', cursor: 'text' }}
      className="editable-field"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default function ResumeTemplate({ data, onChange }: Props) {
  if (!data) return null;
  
  const updateContact = (key: keyof ResumeData['contact'], val: string) => {
    onChange({ ...data, contact: { ...(data.contact || {}), [key]: val } } as ResumeData);
  };

  const updateExperience = (index: number, key: keyof ResumeData['experience'][0], val: string) => {
    const newExp = [...(data.experience || [])];
    newExp[index] = { ...newExp[index], [key]: val };
    onChange({ ...data, experience: newExp });
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const newExp = [...(data.experience || [])];
    const newBullets = [...(newExp[expIndex].bullets || [])];
    newBullets[bulletIndex] = val;
    newExp[expIndex] = { ...newExp[expIndex], bullets: newBullets };
    onChange({ ...data, experience: newExp });
  };

  const updateEducation = (index: number, key: keyof ResumeData['education'][0], val: string) => {
    const newEdu = [...(data.education || [])];
    newEdu[index] = { ...newEdu[index], [key]: val };
    onChange({ ...data, education: newEdu });
  };

  const updateProject = (index: number, key: keyof ResumeData['projects'][0], val: string) => {
    const newProj = [...(data.projects || [])];
    newProj[index] = { ...newProj[index], [key]: val };
    onChange({ ...data, projects: newProj });
  };

  const updateSkill = (index: number, val: string) => {
    const newSkills = [...(data.skills || [])];
    newSkills[index] = val;
    onChange({ ...data, skills: newSkills });
  };

  return (
    <div id="resume-template-container" style={{ display: 'flex', flexDirection: 'row', fontFamily: 'Helvetica', color: '#333', background: '#fff', borderRadius: '8px', overflow: 'hidden', minHeight: '800px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      {/* Left Column */}
      <div style={{ width: '30%', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '2rem 1.5rem' }}>
        <EditableText tagName="h1" value={data.name || "Your Name"} onChange={(v) => onChange({...data, name: v})} style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid #34495e', paddingBottom: '0.5rem', lineHeight: '1.2' }} />
        
        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: '#3498db' }}>Contact</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <div><strong>📞 Phone</strong> <EditableText value={data.contact?.phone || ""} onChange={(v) => updateContact('phone', v)} /></div>
          <div><strong>✉️ Email</strong> <EditableText value={data.contact?.email || ""} onChange={(v) => updateContact('email', v)} /></div>
          <div><strong>🔗 LinkedIn</strong> <EditableText value={data.contact?.linkedin || ""} onChange={(v) => updateContact('linkedin', v)} /></div>
          <div><strong>💻 GitHub</strong> <EditableText value={data.contact?.github || ""} onChange={(v) => updateContact('github', v)} /></div>
        </div>

        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: '#3498db' }}>Skills</h2>
        <ul style={{ paddingLeft: '1rem', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(data.skills || []).map((skill, idx) => (
            <li key={idx}>
              <EditableText tagName="span" value={skill} onChange={(v) => updateSkill(idx, v)} />
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column */}
      <div style={{ width: '70%', padding: '2rem 2.5rem', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#2c3e50', textTransform: 'uppercase' }}>Professional Summary</h2>
        <EditableText tagName="p" value={data.summary || ""} onChange={(v) => onChange({...data, summary: v})} style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '2rem' }} />

        <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#2c3e50', textTransform: 'uppercase' }}>Experience</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {(data.experience || []).map((exp, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                <EditableText tagName="h3" value={exp.title || ""} onChange={(v) => updateExperience(idx, 'title', v)} style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#34495e' }} />
                <EditableText tagName="span" value={exp.duration || ""} onChange={(v) => updateExperience(idx, 'duration', v)} style={{ fontSize: '0.85rem', color: '#7f8c8d' }} />
              </div>
              <EditableText tagName="div" value={exp.company || ""} onChange={(v) => updateExperience(idx, 'company', v)} style={{ fontSize: '0.95rem', fontWeight: '500', color: '#3498db', marginBottom: '0.5rem' }} />
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: '#333' }}>
                {(exp.bullets || []).map((bullet, bIdx) => (
                  <li key={bIdx} style={{ marginBottom: '0.3rem' }}>
                    <EditableText tagName="span" value={bullet} onChange={(v) => updateExperienceBullet(idx, bIdx, v)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#2c3e50', textTransform: 'uppercase' }}>Projects</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {(data.projects || []).map((proj, idx) => (
            <div key={idx}>
              <EditableText tagName="h3" value={proj.name || ""} onChange={(v) => updateProject(idx, 'name', v)} style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#34495e', marginBottom: '0.2rem' }} />
              <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                <strong>Tech:</strong> <EditableText tagName="span" value={proj.technologies || ""} onChange={(v) => updateProject(idx, 'technologies', v)} />
              </div>
              <EditableText tagName="p" value={proj.description || ""} onChange={(v) => updateProject(idx, 'description', v)} style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }} />
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.4rem', borderBottom: '2px solid #ecf0f1', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#2c3e50', textTransform: 'uppercase' }}>Education</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(data.education || []).map((edu, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <EditableText tagName="div" value={edu.degree || ""} onChange={(v) => updateEducation(idx, 'degree', v)} style={{ fontSize: '1rem', fontWeight: 'bold', color: '#34495e' }} />
                <EditableText tagName="div" value={edu.institution || ""} onChange={(v) => updateEducation(idx, 'institution', v)} style={{ fontSize: '0.9rem', color: '#7f8c8d' }} />
              </div>
              <EditableText tagName="span" value={edu.year || ""} onChange={(v) => updateEducation(idx, 'year', v)} style={{ fontSize: '0.85rem', color: '#7f8c8d' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
