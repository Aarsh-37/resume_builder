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

    Use markdown formatting, but DO NOT wrap your response in ```markdown or ``` code blocks. Output the raw text directly.

    Save only resume content.
    """,
    expected_output="Complete ATS Resume in Markdown format",
    output_file="output/resume.md"
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
    Format as markdown (without code blocks).
    """,
    expected_output="Professional Cover Letter",
    output_file="output/cover_letter.md"
)

linkedin_task = Task(
    description="""
    Using the candidate profile:
    {profile}

    Write a highly engaging LinkedIn 'About' section that highlights their skills and ambitions.
    Format as markdown (without code blocks).
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

    Generate 5 technical and 5 behavioral interview questions they are likely to be asked, along with tips on how they should answer based on their specific experience.
    Format as markdown (without code blocks).
    """,
    expected_output="Interview Prep Questions",
    output_file="output/interview.md"
)