import { NextResponse } from "next/server";
import OpenAI from "openai";
import puppeteer from "puppeteer";

const openai = new OpenAI();

export async function POST(req) {
  const data = await req.json();
  const target_url = data.link;

  const professorData = await scraper(target_url);
  const analysis = await getRecommendation(professorData);
  const response = {
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
  let browser;
  try {
    // Setup
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Go to the website
    await page.goto(target_url, {
      waitUntil: "networkidle0",
    });

    // Handle cookie agreement panel
    try {
      console.log("Checking for cookie agreement panel...");
      await page.waitForSelector(
        "button.CCPAModal__StyledCloseButton-sc-10x9kq-2",
        { timeout: 5000 }
      );
      console.log("Cookie agreement panel found. Closing it...");
      await page.click("button.CCPAModal__StyledCloseButton-sc-10x9kq-2");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log("No cookie agreement panel found or unable to close it.");
      throw new Error("Unable to close cookie agreement panel.");
    }

    const professorData = await page.evaluate(() => {
      // Extracting professor name
      const firstNameElement = document.querySelector(
        ".NameTitle__Name-dowf0z-0 span"
      );
      const lastNameElement = document.querySelector(
        ".NameTitle__LastNameWrapper-dowf0z-2"
      );
      const professorName =
        firstNameElement && lastNameElement
          ? `${firstNameElement.textContent.trim()} ${lastNameElement.textContent.trim()}`
          : "";

      // Extracting department
      const departmentElement = document.querySelector(
        ".TeacherDepartment__StyledDepartmentLink-fl79e8-0 b"
      );
      const department = departmentElement
        ? departmentElement.textContent.trim()
        : "";

      // Extracting school name
      const schoolElement = document.querySelector(
        '.NameTitle__Title-dowf0z-1 > a[href^="/school/"]'
      );
      const school = schoolElement ? schoolElement.textContent.trim() : "";

      // Extracting % of "Would take again"
      const wouldTakeAgainElement = document.querySelectorAll(
        ".FeedbackItem__StyledFeedbackItem-uof32n-0 .FeedbackItem__FeedbackNumber-uof32n-1"
      )[0];
      const wouldTakeAgain = wouldTakeAgainElement
        ? wouldTakeAgainElement.textContent.trim()
        : "";

      // Extracting "Level of Difficulty"
      const difficultyLevelElement = document.querySelectorAll(
        ".FeedbackItem__StyledFeedbackItem-uof32n-0 .FeedbackItem__FeedbackNumber-uof32n-1"
      )[1];
      const difficultyLevel = difficultyLevelElement
        ? difficultyLevelElement.textContent.trim()
        : "";

      // Extracting comments and combining them into a string
      const commentElements = document.querySelectorAll(
        ".Comments__StyledComments-dzzyvm-0"
      );
      const comments = Array.from(commentElements)
        .map((comment) => comment.textContent.trim())
        .join(" ");

      return {
        professorName,
        department,
        school,
        wouldTakeAgain,
        difficultyLevel,
        comments,
      };
    });

    return professorData;
  } catch (error) {
    console.error("Error scraping:", error);
    throw new Error("Error scraping.");
  } finally {
    await browser.close();
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
