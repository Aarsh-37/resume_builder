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

    Produce

    - ATS Score (/100)
    - Missing Skills
    - Matching Skills
    - Improvement Plan

    Save ATS report separately.
    """,

    expected_output="Skill Gap Analysis",

    output_file="output/ats_report.md"
)

improvement_task = Task(
    description="""
    Based on the gap analysis,
    create a roadmap for improving
    the resume and candidate profile.

    Save in markdown.
    """,

    expected_output="Improvement Plan",

    output_file="output/improvement_plan.md"
)