from openai import OpenAI

from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)


def analyze_lead(name: str, company: str | None, message: str) -> dict:
    prompt = f"""
You are a sales analyst. Analyze the following lead and return a JSON response.

Lead information:
- Name: {name}
- Company: {company or "Not provided"}
- Message: {message}

Return ONLY a valid JSON object with these exact fields:
{{
  "classification": "hot" or "cold",
  "score": a number from 1 to 10,
  "ai_reason": "one sentence explaining the score"
}}

Scoring guide:
- High score (7-10) = hot lead: clear budget, urgent need, enterprise/company, specific request
- Low score (1-4) = cold lead: vague message, no company, no budget, just browsing
- Medium score (5-6) = warm lead: some interest but missing key details
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.2,
    )

    result = response.choices[0].message.content
    import json
    return json.loads(result)
