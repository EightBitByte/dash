import { load } from "cheerio";

export interface DealItem {
  id: string;
  title: string;
  url: string;
  image?: string;
  date?: string;
}

export async function getDeals(): Promise<DealItem[]> {
  try {
    // Tech deals feed
    const FEED_URL =
      "https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchin=first&sort=newest&q=tech&rss=1";

    const response = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.statusText}`);
    }
    const xml = await response.text();
    const $ = load(xml, { xmlMode: true });

    const items: DealItem[] = [];

    $("item").each((_, element) => {
      const item = $(element);
      const title = item.find("title").text();
      const link = item.find("link").text();
      const guid = item.find("guid").text();
      const pubDate = item.find("pubDate").text();
      const contentEncoded = item.find("content\\:encoded").text(); // cheerio handles namespaced tags
      const description = item.find("description").text();

      // Attempt to extract image from content or description
      const content = contentEncoded || description || "";
      const imgMatch = content.match(/src="([^"]+)"/);
      const image = imgMatch ? imgMatch[1] : undefined;

      items.push({
        id: guid || link || Math.random().toString(),
        title: title || "Unknown Deal",
        url: link || "#",
        image,
        date: pubDate,
      });
    });

    return items.slice(0, 5);
  } catch (error) {
    console.error("Error fetching Slickdeals:", error);
    return [];
  }
}
