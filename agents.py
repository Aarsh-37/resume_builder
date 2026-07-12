from crewai import Agent, LLM

llm = LLM(
    model="ollama/llama3.2",
    base_url="http://localhost:11434",
    temperature=0.2,
)

resume_agent = Agent(
    role="Resume Writer",
    goal="Create ATS optimized resume",
    backstory="""
    You are an expert HR professional with years of
    experience creating ATS friendly resumes.
    """,
    llm=llm,
    verbose=True,
)

ats_reviewer_agent = Agent(
    role="ATS Reviewer",
    goal="Understand job requirements and evaluate resumes",
    backstory="""
    You are an expert recruiter and Applicant Tracking System (ATS) algorithm.
    Extract required skills, technologies, and qualifications, then evaluate candidates.
    """,
    llm=llm,
    verbose=True
)

career_coach_agent = Agent(
    role="Career Coach",
    goal="Provide skill gap analysis and career improvement plans",
    backstory="""
    You are an elite Career Coach. You compare candidate skills with job requirements
    and suggest actionable roadmaps, certifications, and improvements.
    """,
    llm=llm,
    verbose=True
)