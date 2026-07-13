"use client";
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';
import { saveAs } from 'file-saver';
import { pdf, Document, Page, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import ResumeTemplate, { ResumeData } from './ResumeTemplate';

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  }
});

const ResumePDFDocument = ({ htmlContent }: { htmlContent: string }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Html resetStyles>{htmlContent}</Html>
    </Page>
  </Document>
);

type Job = {
  id: number;
  company: string;
  title: string;
  location: string;
  description: string;
  apply_link: string;
  match_score: number;
};

export default function Home() {
  const [profile, setProfile] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{resume: string, ats_report: string, improvement_plan: string, cover_letter: string, linkedin_about: string, interview_questions: string} | null>(null);
  const [parsedResume, setParsedResume] = useState<ResumeData | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');

  const [activeTab, setActiveTab] = useState<'resume' | 'ats_report' | 'improvement_plan' | 'jobs' | 'cover_letter' | 'linkedin' | 'interview'>('resume');
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    setUploadingPdf(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to parse PDF');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setProfile(data.extracted_text);
    } catch (err: any) {
      alert(err.message || 'Error parsing PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFetchJobs = async () => {
    if (!profile) return;
    setJobsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, job_description: jobDescription || "General" }),
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      console.error(err);
      alert('Error fetching jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile, job_description: jobDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      setResults(data);
      try {
        let resumeText = data.resume;
        resumeText = resumeText.replace(/```json/gi, '').replace(/```/g, '').trim();
        setParsedResume(JSON.parse(resumeText));
      } catch (e) {
        console.error("Failed to parse resume JSON", e);
      }
      setActiveTab('resume');
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to the backend. Is the FastAPI server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!results?.resume) return;
    setExportLoading(true);

    try {
      let htmlString = "";
      const templateEl = document.getElementById('resume-template-container');
      if (templateEl) {
        htmlString = templateEl.outerHTML;
      } else {
        const cleanMarkdown = results.resume.replace(/^```(markdown)?\n/, '').replace(/\n```$/, '');
        htmlString = marked.parse(cleanMarkdown) as string;
      }

      const styledHtml = `
        <html>
          <body>
            <style>
              body, div, p, span, ul, ol, li, strong, em, b, i { font-size: 10px; }
              h1, h1 * { font-size: 15px; margin-bottom: 6px; border-bottom: 1px solid #333; padding-bottom: 4px; }
              h2, h2 * { font-size: 13px; margin-top: 10px; margin-bottom: 6px; color: #444; }
              h3, h3 * { font-size: 11px; margin-top: 8px; margin-bottom: 4px; }
              h4, h4 * { font-size: 10px; font-weight: bold; margin-top: 6px; margin-bottom: 4px; }
              p { margin-bottom: 6px; }
              ul { margin-bottom: 6px; padding-left: 14px; }
              li { margin-bottom: 3px; }
            </style>
            ${htmlString}
          </body>
        </html>
      `;

      const blob = await pdf(<ResumePDFDocument htmlContent={styledHtml} />).toBlob();
      saveAs(blob, 'resume.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportWord = async () => {
    if (!results?.resume) return;
    setExportLoading(true);

    try {
      let htmlString = "";
      const templateEl = document.getElementById('resume-template-container');
      if (templateEl) {
        htmlString = templateEl.outerHTML;
      } else {
        const cleanMarkdown = results.resume.replace(/^```(markdown)?\n/, '').replace(/\n```$/, '');
        htmlString = marked.parse(cleanMarkdown) as string;
      }
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Resume</title></head>
        <body style="font-family: 'Arial', sans-serif;">${htmlString}</body>
        </html>
      `;
      const blob = new Blob(['\ufeff', wordHtml], {
        type: 'application/msword'
      });
      saveAs(blob, 'resume.doc');
    } catch (err) {
      console.error('Error generating Word doc:', err);
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const getCleanMarkdown = (text: string) => {
    if (!text) return "";
    let clean = text.replace(/^```(markdown)?\n/, '').replace(/\n```$/, '');
    
    // Safely fix literal bullet characters (•) by converting them to Markdown bullets
    clean = clean.replace(/^•\s*/gm, '- ');
    
    // Fix asterisks or hyphens missing a space (e.g. "*Developed" -> "- Developed")
    // without breaking bold text (e.g. "**Skills**")
    clean = clean.replace(/^([\*\-])([a-zA-Z0-9])/gm, '- $2');
    
    return clean;
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <span className="gradient-text">Resume Builder</span>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          className="btn-outline" 
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      <main className="container fade-in">
        <div className="dashboard-grid">

          {/* Input Section */}
          <div className="card">
            <h2 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
              Input Details
            </h2>

            <div 
              className="input-group"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleDrop}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="label" style={{ marginBottom: 0 }}>Student Profile / Experience</label>
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    id="pdf-upload"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor="pdf-upload" className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', gap: '0.3rem', alignItems: 'center', borderRadius: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Upload PDF
                  </label>
                </div>
              </div>
              <textarea
                className={`textarea ${isDragging ? 'drag-active' : ''}`}
                style={{ minHeight: '120px', position: 'relative' }}
                placeholder={isDragging ? "Drop PDF here!" : "Paste your profile, education, skills... OR drag and drop your existing Resume PDF here!"}
                value={uploadingPdf ? "Parsing PDF... Please wait." : profile}
                onChange={(e) => setProfile(e.target.value)}
                disabled={uploadingPdf}
              />
            </div>

            <div className="input-group">
              <label className="label">Target Job Description</label>
              <textarea
                className="textarea"
                style={{ minHeight: '120px' }}
                placeholder="Paste the job description you want to apply for..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="error-banner fade-in">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleGenerate}
              disabled={loading || !profile || !jobDescription}
            >
              {loading ? (
                <>
                  <svg className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }} viewBox="0 0 50 50"></svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Generate Resume
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              AI Analysis & Output
            </h2>

            {!loading && !results && (
              <div className="empty-state fade-in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg>
                <p>Provide your details on the left to generate an ATS-optimized resume.</p>
              </div>
            )}

            {loading && (
              <div className="loader-container fade-in">
                <div className="spinner"></div>
                <div className="loading-pulse">Our AI Agents are analyzing your profile...</div>
              </div>
            )}

            {results && !loading && (
              <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>

                  <div className="tabs-container">
                    <button
                      className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
                      onClick={() => setActiveTab('resume')}
                    >
                      ATS Resume
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'ats_report' ? 'active' : ''}`}
                      onClick={() => setActiveTab('ats_report')}
                    >
                      Skill Gap Report
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'improvement_plan' ? 'active' : ''}`}
                      onClick={() => setActiveTab('improvement_plan')}
                    >
                      Improvement Plan
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'cover_letter' ? 'active' : ''}`}
                      onClick={() => setActiveTab('cover_letter')}
                    >
                      Cover Letter
                    </button>

                    <button 
                      className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('interview')}
                    >
                      Interview Prep
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab('jobs');
                        if (jobs.length === 0) handleFetchJobs();
                      }}
                    >
                      Job Matches
                    </button>
                  </div>

                  {activeTab === 'resume' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="btn-outline pdf"
                        onClick={handleExportPDF}
                        disabled={exportLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        {exportLoading ? '...' : 'PDF'}
                      </button>
                      <button
                        className="btn-outline word"
                        onClick={handleExportWord}
                        disabled={exportLoading}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        {exportLoading ? '...' : 'Word'}
                      </button>
                    </div>
                  )}
                </div>

                {activeTab === 'jobs' ? (
                  <div className="jobs-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="jobs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Filter by location..."
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="textarea"
                        style={{ minHeight: '40px', width: '300px' }}
                      />
                      <button className="btn-outline" onClick={handleFetchJobs} disabled={jobsLoading}>
                        {jobsLoading ? 'Scoring Jobs...' : 'Refresh Matches'}
                      </button>
                    </div>

                    {jobsLoading && (
                      <div className="loader-container fade-in" style={{ padding: '2rem' }}>
                        <div className="spinner"></div>
                        <div className="loading-pulse">AI is scoring job matches...</div>
                      </div>
                    )}

                    {!jobsLoading && jobs.length > 0 && (
                      <div className="jobs-grid" style={{ display: 'grid', gap: '1rem' }}>
                        {jobs
                          .filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()))
                          .map(job => (
                            <div key={job.id} className="card fade-in" style={{ borderLeft: `4px solid ${job.match_score >= 80 ? '#10b981' : job.match_score >= 60 ? '#f59e0b' : '#ef4444'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', margin: 0 }}>{job.title}</h3>
                                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                      Trusted Source (Remotive)
                                    </span>
                                  </div>
                                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{job.company} • {job.location}</p>
                                </div>
                                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: job.match_score >= 80 ? '#10b981' : job.match_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                                    {job.match_score}%
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Match</div>
                                </div>
                              </div>
                              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '1rem 0', lineHeight: '1.5' }}>{job.description}</p>
                              <a href={job.apply_link} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                                Apply Now
                              </a>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : activeTab === 'resume' && parsedResume ? (
                  <ResumeTemplate data={parsedResume} onChange={setParsedResume} />
                ) : (
                  <div className="markdown-wrapper">
                    <div className="markdown-body">
                      <ReactMarkdown>{getCleanMarkdown(results[activeTab === 'linkedin' ? 'linkedin_about' : activeTab === 'interview' ? 'interview_questions' : activeTab])}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
      </main>
    </>
  );
}
