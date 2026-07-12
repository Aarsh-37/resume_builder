from crewai import Task
import os

with open(os.path.join(os.path.dirname(__file__), 'latex_template.txt'), 'r', encoding='utf-8') as f:
    latex_template = f.read().replace('{', '{{').replace('}', '}}')

resume_task = Task(
    description=f"""
    Using the student's profile:

    {{profile}}

    Create a professional ATS friendly resume tailored for the job:
    {{job_description}}

    CRITICAL: You MUST output the resume using EXACTLY the following LaTeX template structure.
    Do NOT output Markdown. Do NOT output any conversational text. Output ONLY valid LaTeX code.
    Fill in the placeholders (CANDIDATE NAME, SKILLS HERE, EXPERIENCE HERE) with the candidate's actual data.
    Make sure to strictly adhere to 1 page limit by not making descriptions too long.

    LaTeX Template:
    {latex_template}

    Save only the LaTeX content.
    """,
    expected_output="Complete ATS Resume in LaTeX format",
    output_file="output/resume.tex"
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