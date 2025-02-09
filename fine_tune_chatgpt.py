import os
import json
import openai
import pandas as pd
import jsonlines

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("API key not found. Make sure OPENAI_API_KEY is set.")

client = openai.OpenAI(api_key=api_key)

PURE_DATASET_PATH = "pure_dataset.csv" 
TRAINING_FILE_PATH = "fine_tune_data.jsonl"

df = pd.read_csv(PURE_DATASET_PATH)

if "functional_requirement" not in df.columns or "non_functional_requirement" not in df.columns:
    raise ValueError("Dataset must contain 'functional_requirement' and 'non_functional_requirement' columns.")

with jsonlines.open(TRAINING_FILE_PATH, mode="w") as writer:
    for _, row in df.iterrows():
        writer.write({
            "messages": [
                {"role": "system", "content": "You are an AI trained to generate non-functional requirements (NFRs)."},
                {"role": "user", "content": f"Generate NFRs for: {row['functional_requirement']}"},
                {"role": "assistant", "content": row["non_functional_requirement"]}
            ]
        })

print(f"Converted dataset saved as {TRAINING_FILE_PATH}")

print("Uploading training data...")
upload_response = client.files.create(
    file=open(TRAINING_FILE_PATH, "rb"),
    purpose="fine-tune"
)
file_id = upload_response.id
print(f"Training file uploaded with ID: {file_id}")

print("Starting fine-tuning process...")
fine_tune_response = client.fine_tunes.create(training_file=file_id, model="gpt-4o-mini")
fine_tune_id = fine_tune_response.id
print(f"Fine-tuning started with ID: {fine_tune_id}")

import time

while True:
    fine_tune_status = client.fine_tunes.retrieve(fine_tune_id)
    status = fine_tune_status.status
    print(f"Fine-tuning status: {status}")

    if status in ["succeeded", "failed"]:
        break
    
    time.sleep(60)

if status == "succeeded":
    fine_tuned_model = fine_tune_status.fine_tuned_model
    print(f"Fine-tuning completed successfully! Model ID: {fine_tuned_model}")

    response = client.chat.completions.create(
        model=fine_tuned_model,
        messages=[{"role": "user", "content": "Generate one NFR for a cloud storage system."}],
        temperature=0.7
    )

    print("Generated NFR:", response.choices[0].message.content)

else:
    print("Fine-tuning failed. Check OpenAI logs for more details.")
