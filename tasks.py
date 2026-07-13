from crewai import Task

resume_task = Task(
    description="""
    Using the student's profile:

    {profile}

    Create a professional ATS friendly resume tailored for the job:
    {job_description}

    Theme Style: {theme}
    CRITICAL: The resume MUST be strictly 1 PAGE MAX. 
    RULES TO ENFORCE 1-PAGE LIMIT:
    - Maximum 3 bullet points per work experience.
    - Keep the professional summary under 3 sentences.
    - Do not include references or filler words.
    - Omit irrelevant or very old experience.

    Use JSON format. Output ONLY raw JSON, with no markdown code blocks wrapping it.
    The JSON structure MUST follow this exact schema:
    {
      "name": "Full Name",
      "contact": { "email": "...", "phone": "...", "linkedin": "...", "github": "..." },
      "summary": "Professional Summary",
      "skills": ["Skill 1", "Skill 2", "..."],
      "experience": [
        { "title": "Job Title", "company": "Company", "duration": "Dates", "bullets": ["Point 1", "Point 2"] }
      ],
      "education": [
        { "degree": "Degree", "institution": "School", "year": "Year" }
      ],
      "projects": [
        { "name": "Project Name", "description": "Brief description", "technologies": "Tech stack" }
      ]
    }
    """,
    expected_output="Strict JSON object representing the ATS Resume",
    output_file="output/resume.json"
)

job_analysis_task = Task(
    description="""
    Analyze the following Job Description.

    {job_description}

    Extract

    - Required Skills
    - Preferred Skills
    - Responsibilities
    - Experience
    - Keywords
    """,

    expected_output="Job Analysis"
)

skill_gap_task = Task(
    description="""
    Compare

    Student Profile

    {profile}

    with

    Job Description

    {job_description}

    Produce:
    - ATS Score (/100)
    - Keyword Analysis
    - Strengths and Weaknesses
    - Missing Skills
    - Matching Skills

    IMPORTANT: Do NOT output JSON. Do NOT include the candidate's raw details. Output ONLY the analysis in professional Markdown format.
    Save ATS report separately.
    """,

    expected_output="Skill Gap Analysis",

    output_file="output/ats_report.md"
)

improvement_task = Task(
    description="""
    Based on the gap analysis, create an actionable improvement plan.
    
    Produce:
    - Missing Skills to acquire
    - Recommended Certifications
    - A step-by-step Career Roadmap

    IMPORTANT: Do NOT output JSON. Format as plain markdown.
    Save in markdown.
    """,

    expected_output="Improvement Plan",

    output_file="output/improvement_plan.md"
)

job_scoring_task = Task(
    description="""
    You are an ATS algorithm. You have been given a candidate's profile:
    {profile}

    And a list of job postings in JSON format:
    {jobs_json}

    For each job, calculate a realistic match score (0-100) based on how well the candidate's skills match the job requirements.
    
    Output ONLY a valid JSON array of objects, where each object has exactly two keys: "id" (the integer job id) and "match_score" (integer).
    DO NOT output any conversational text. DO NOT wrap the output in markdown blocks. 
    Example: [{"id": 1, "match_score": 85}, {"id": 2, "match_score": 40}]
    """,
    expected_output="JSON array of job match scores",
)

cover_letter_task = Task(
    description="""
    Using the candidate profile:
    {profile}

    And the job description:
    {job_description}

    Write a compelling, professional Cover Letter.
    CRITICAL: If the job description is vague or does not provide a specific company name or detailed requirements, do NOT hallucinate or invent a random company or random job details. Use placeholders like [Target Company Name] and write a generalized but strong cover letter based ONLY on the provided relevant sources.
    
    IMPORTANT: Do NOT output JSON. Format as plain markdown (without code blocks).
    """,
    expected_output="Professional Cover Letter",
    output_file="output/cover_letter.md"
)

linkedin_task = Task(
    description="""
    Using the candidate profile:
    {profile}

    Write a highly engaging LinkedIn 'About' section that highlights their skills and ambitions.
    IMPORTANT: Do NOT output JSON. Format as plain markdown (without code blocks).
    """,
    expected_output="LinkedIn About Section",
    output_file="output/linkedin.md"
)

interview_task = Task(
    description="""
    Based on the job description:
    {job_description}

    And the candidate's profile:
    {profile}

    Generate highly tailored interview questions divided into three sections:
    1. Tech Stack Questions: Deep-dive questions on the specific technologies mentioned in their profile.
    2. Project Questions: Questions challenging the architecture, decisions, and outcomes of the projects on their resume.
    3. Normal / Behavioral Questions: Standard culture-fit and behavioral questions.
    
    Provide brief tips on how the candidate should answer each question.
    IMPORTANT: Do NOT output JSON. Format as plain markdown (without code blocks).
    """,
    expected_output="Interview Prep Questions",
    output_file="output/interview.md"
)