import json
import os
import uuid
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv()

INDEX_NAME = "rate-my-professor-rag"
JSON_TO_LOAD = "data_by_school_name.json"

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Load the review data
data = json.load(open(JSON_TO_LOAD))


processed_data = []
client = OpenAI()

# Create embeddings for each review and generate IDs
for review in data:
    text_to_embed = f"School: {review['school_name']}, Professor: {review['professor_name']}, Department: {review['department_name']}, Star Rating: {review['star_rating']}, Comments: {review['comments']}"
    response = client.embeddings.create(
        input=text_to_embed, model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    processed_data.append(
        {
            "values": embedding,
            "id": str(uuid.uuid4()),
            "metadata": {
                "school_name": review["school_name"],
                "professor_name": review["professor_name"],
                "department_name": review["department_name"],
                "star_rating": review["star_rating"],
                "comments": review["comments"],
            }
        }
    )

# Insert the embeddings into the Pinecone index
index = pc.Index(INDEX_NAME)
upsert_response = index.upsert(
    vectors=processed_data,
    namespace="ns1",
)

print(f"Upserted count: {upsert_response['upserted_count']}")

# Print index statistics
print(index.describe_index_stats())
