import Parser from "rss-parser";

export interface DealItem {
  id: string;
  title: string;
  url: string;
  image?: string;
  date?: string;
}

const SlickdealsParser = new Parser({
  customFields: {
    item: ["media:content", "content:encoded"],
  },
});

export async function getDeals(): Promise<DealItem[]> {
  try {
    // Tech deals feed
    const FEED_URL =
      "https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchin=first&sort=newest&q=tech&rss=1";
    const feed = await SlickdealsParser.parseURL(FEED_URL);

    return feed.items
      .map((item) => {
        // Attempt to extract image from content or description
        const content = item["content:encoded"] || item.content || "";
        const imgMatch = content.match(/src="([^"]+)"/);
        const image = imgMatch ? imgMatch[1] : undefined;

        return {
          id: item.guid || item.link || Math.random().toString(),
          title: item.title || "Unknown Deal",
          url: item.link || "#",
          image,
          date: item.pubDate,
        };
      })
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching Slickdeals:", error);
    return [];
  }
}
