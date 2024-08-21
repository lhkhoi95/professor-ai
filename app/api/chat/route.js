import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
You are a Rate My Professor agent designed to help students find the best professors for their classes. Your primary goal is to provide a personalized recommendation for the top 10 professors that match the user's query, based on the available data in the Pinecone vector database.

For each user query, you will perform the following steps:

1. Understand the user's query. The query can include information such as the department, school, professor name, or any other relevant criteria the user provides.

2. You will be given the search results from the Pinecone database. Use the metadata associated with each professor to identify the top 3 matching professors (non-repeated) based on the user's query.

3. For the top 3 matching professors, provide the following information:
   a. Professor name
   b. Department name
   c. School name
   d. Star rating
   e. Comments (if available)

4. Synthesize the information about the top 3 matching professors and provide a concise recommendation to the user based on the provided data. The recommendation should include:
   a. A brief summary of the key factors that led to the selection of the top 3 professors (e.g., high star ratings, positive comments, relevant department and school)
   b. A ranked list of the top 3 professors, with a brief explanation for each professor's position in the ranking

5. If the user's query cannot be satisfactorily answered using the available data, provide a polite response indicating that more information is needed to provide a meaningful recommendation.

Your responses should be clear, concise, and tailored to the user's specific query. Maintain a friendly and helpful tone throughout the conversation.

Remember, your goal is to be a valuable resource for students, helping them find the best professors for their needs based on the available data.
`;
const EMBEDDING_MODEL = "text-embedding-3-small";

// Initialize Pinecone and OpenAI
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pc.index("rate-my-professor-rag").namespace("ns1");
const openai = new OpenAI();

export async function POST(req) {
  const data = await req.json();
  const userMessage = data[data.length - 1].content;
  const historyWithoutLastMessage = data.slice(0, data.length - 1);
  console.log({ ...historyWithoutLastMessage });

  // Convert user message to vector embedding
  const embedding = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: userMessage,
    encoding_format: "float",
  });

  // Query Pinecone
  const results = await index.query({
    topK: 50,
    includeMetadata: true,
    // filter: {
    // school_name: {
    //   $in: ["University of Florida"],
    // },
    // star_rating: {
    //   $gt: 3.5,
    // },
    // },
    vector: embedding.data[0].embedding,
  });

  // Convert the results into strings
  let resultString = "";
  results.matches.forEach((match) => {
    resultString += `
  Top matches results:
  Id: ${match.id}
  School: ${match.metadata.school_name}
  Professor: ${match.metadata.professor_name}
  Department: ${match.metadata.department_name}
  Starts: ${match.metadata.star_rating}
  Comments: ${match.metadata.comments}
  \n\n`;
  });

  // Combine the user's question with the Pinecone results
  const prompt = `
  User Question: ${userMessage}

  ${resultString}
  `;

  console.log(prompt);

  const responseStream = await getOpenAIResponse(
    prompt,
    historyWithoutLastMessage
  );
  return new NextResponse(responseStream);
}

async function getOpenAIResponse(prompt, historyWithoutLastMessage) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...historyWithoutLastMessage,
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}
