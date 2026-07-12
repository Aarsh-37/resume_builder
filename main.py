from pathlib import Path

from crew import resume_crew


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


base_dir = Path(__file__).resolve().parent
profile_path = base_dir / "input" / "student_profile.txt"
profile = read_file(profile_path)

job_description_path = base_dir / "input" / "job_description.txt"
job = read_file(job_description_path)

inputs = {
    "profile": profile,
    "job_description": job
}

result = resume_crew.kickoff(inputs=inputs)

print(result)