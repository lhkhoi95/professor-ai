import { NextResponse } from "next/server";
import OpenAI from "openai";
import * as cheerio from "cheerio";

const openai = new OpenAI();

export async function POST(req) {
  const data = await req.json();
  const target_url = data.link;
  const professorID = target_url.split("/").pop();

  const professorData = await scraper(target_url);
  const analysis = await getRecommendation(professorData);
  const response = {
    id: professorID,
    name: professorData.professorName,
    department: professorData.department,
    school: professorData.school,
    wouldTakeAgain: professorData.wouldTakeAgain,
    difficultyLevel: professorData.difficultyLevel,
    analysis: analysis,
  };

  return NextResponse.json(response);
}

async function scraper(target_url) {
  try {
    // Fetch the HTML content
    const response = await fetch(target_url);
    const html = await response.text(); // Get the HTML content as a string

    const $ = cheerio.load(html);

    // Extract professor data
    const professorData = {
      professorName: "",
      department: "",
      school: "",
      wouldTakeAgain: "",
      difficultyLevel: "",
      comments: "",
    };

    const firstName = $(".NameTitle__Name-dowf0z-0 span").first().text().trim();
    const lastName = $(".NameTitle__LastNameWrapper-dowf0z-2").text().trim();
    professorData.professorName = `${firstName} ${lastName}`;

    // Department
    professorData.department = $(
      ".TeacherDepartment__StyledDepartmentLink-fl79e8-0 b"
    )
      .text()
      .replace(/department/i, "")
      .trim();

    // School name
    professorData.school = $('.NameTitle__Title-dowf0z-1 > a[href^="/school/"]')
      .text()
      .trim();

    // "Would Take Again" percentage
    const wouldTakeAgainElements = $(
      ".FeedbackItem__StyledFeedbackItem-uof32n-0 .FeedbackItem__FeedbackNumber-uof32n-1"
    );
    professorData.wouldTakeAgain =
      wouldTakeAgainElements.length > 0
        ? wouldTakeAgainElements.first().text().trim()
        : "";

    // "Level of Difficulty"
    professorData.difficultyLevel =
      wouldTakeAgainElements.length > 1
        ? wouldTakeAgainElements.eq(1).text().trim()
        : "";

    // Comments
    const comments = $(".Comments__StyledComments-dzzyvm-0")
      .map((_, element) => $(element).text().trim())
      .get()
      .join(" ");
    professorData.comments = comments;

    return professorData;
  } catch (error) {
    console.error("Error scraping:", error);
    throw new Error("Error scraping.");
  }
}

async function getRecommendation(professorData) {
  const systemPrompt = `
  You are an insightful assistant tasked with analyzing professor data and student comments about a professor. Your goal is to provide a balanced summary that highlights the key points, including the strengths (pros) and weaknesses (cons) of the professor. Additionally, offer a recommendation on whether students should consider taking classes with this professor.

  Return the analysis in the following JSON format:

  {
    "summary": "A concise summary of the overall sentiment and key observations from the comments.",
    "pros": [
      "Highlight of a positive aspect",
      "Another positive aspect",
      "Additional positive aspect"
    ],
    "cons": [
      "Highlight of a negative aspect",
      "Another negative aspect",
      "Additional negative aspect"
    ],
    "recommendation": "A brief recommendation on whether to take or avoid classes with this professor."
  }
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(professorData) },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.log("Error summarizing comments:", error);
    throw new Error("Error summarizing comments.");
  }
}
