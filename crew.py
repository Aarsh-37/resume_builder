from crewai import Crew
from agents import resume_agent, ats_reviewer_agent, career_coach_agent
from tasks import resume_task, job_analysis_task, skill_gap_task, improvement_task, job_scoring_task, cover_letter_task, linkedin_task, interview_task

resume_task.agent = resume_agent
job_analysis_task.agent = ats_reviewer_agent
skill_gap_task.agent = ats_reviewer_agent
improvement_task.agent = career_coach_agent
job_scoring_task.agent = ats_reviewer_agent
cover_letter_task.agent = resume_agent
linkedin_task.agent = resume_agent
interview_task.agent = career_coach_agent

resume_crew = Crew(
    agents=[resume_agent, ats_reviewer_agent, career_coach_agent],
    tasks=[resume_task, job_analysis_task, skill_gap_task, improvement_task, cover_letter_task, linkedin_task, interview_task],
    verbose=True
)

job_scoring_crew = Crew(
    agents=[ats_reviewer_agent],
    tasks=[job_scoring_task],
    verbose=True
)