import * as cheerio from "cheerio";

export interface GymHours {
  regular: string[];
  upcoming: string[];
}

export async function scrapeArcHours(): Promise<GymHours> {
  try {
    const res = await fetch("https://www.campusrec.uci.edu/arc/hours.html", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Find the ARC Hours section
    // Based on inspection: h3.service-box-title containing "ARC Hours" -> sibling div.latest-post-meta
    const container = $('h3.service-box-title:contains("ARC Hours")')
      .closest(".ts-service-info")
      .find(".latest-post-meta");

    if (!container.length) {
      console.error("Could not find ARC Hours container");
      return { regular: [], upcoming: [] };
    }

    // Extract text nodes and clean them
    const htmlContent = container.html() || "";
    // Split by <br> tags
    const lines = htmlContent
      .split(/<br\s*\/?>/i)
      .map((line) => {
        // Remove HTML tags from lines
        return cheerio.load(line).text().trim();
      })
      .filter((line) => line.length > 0);

    const regular: string[] = [];
    const upcoming: string[] = [];
    let isUpcoming = false;

    for (const line of lines) {
      if (line.includes("Upcoming Modified ARC Hours")) {
        isUpcoming = true;
        continue;
      }
      if (isUpcoming) {
        upcoming.push(line);
      } else {
        regular.push(line);
      }
    }

    return { regular, upcoming };
  } catch (error) {
    console.error("Error scraping ARC hours:", error);
    return { regular: ["Failed to load hours"], upcoming: [] };
  }
}
