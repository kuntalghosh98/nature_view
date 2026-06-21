const fs = require("fs");
const path = require("path");
const Project = require("../models/Project");
const Attraction = require("../models/Attraction");
const News = require("../models/News");
const Event = require("../models/Event");

function safeRegex(value) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

function loadFallback(fileName) {
  try {
    const json = fs.readFileSync(path.join(__dirname, "../../fallback", fileName), "utf8");
    return JSON.parse(json);
  } catch (_err) {
    return [];
  }
}

function mapResult(item, type, urlPrefix) {
  return {
    _id: item._id || item.slug,
    type,
    title: item.title?.en || item.slug,
    summary: item.summary?.en || item.body?.en || "",
    location: item.location || "",
    slug: item.slug,
    url: `${urlPrefix}/${item.slug}`,
    featuredImage: item.featuredImage && typeof item.featuredImage !== "string" ? item.featuredImage.url : item.featuredImage || null
  };
}

async function searchContent(req, res, next) {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) {
      return res.json({ success: true, data: [] });
    }

    const regex = safeRegex(query);
    const textQuery = {
      isPublished: true,
      $or: [
        { "title.en": regex },
        { "summary.en": regex },
        { "body.en": regex }
      ]
    };

    const eventQuery = {
      isPublished: true,
      $or: [
        { "title.en": regex },
        { "summary.en": regex },
        { "body.en": regex },
        { location: regex }
      ]
    };

    const [projects, attractions, newsItems, events] = await Promise.all([
      Project.find(textQuery).limit(15).lean(),
      Attraction.find(textQuery).limit(15).lean(),
      News.find(textQuery).limit(15).lean(),
      Event.find(eventQuery).limit(15).lean()
    ]);

    let results = [
      ...projects.map((item) => mapResult(item, "project", "/projects")),
      ...attractions.map((item) => mapResult(item, "attraction", "/attractions")),
      ...newsItems.map((item) => mapResult(item, "news", "/news")),
      ...events.map((item) => mapResult(item, "event", "/events"))
    ];

    if (results.length === 0) {
      const fallbackProjects = loadFallback("projects.json");
      const fallbackAttractions = loadFallback("attractions.json");
      const fallbackNews = loadFallback("news.json");
      const fallbackEvents = loadFallback("events.json");

      const fallbackRegex = safeRegex(query);
      const matches = (items) =>
        items.filter(
          (item) =>
            fallbackRegex.test(item.title?.en || "") ||
            fallbackRegex.test(item.summary?.en || "") ||
            fallbackRegex.test(item.body?.en || "") ||
            fallbackRegex.test(item.location || "")
        );

      results = [
        ...matches(fallbackProjects).map((item) => mapResult(item, "project", "/projects")),
        ...matches(fallbackAttractions).map((item) => mapResult(item, "attraction", "/attractions")),
        ...matches(fallbackNews).map((item) => mapResult(item, "news", "/news")),
        ...matches(fallbackEvents).map((item) => mapResult(item, "event", "/events"))
      ];
    }

    results = results
      .sort((a, b) => {
        const score = (item) => {
          if (item.title.toLowerCase().startsWith(query.toLowerCase())) return 1;
          if (item.summary?.toLowerCase().includes(query.toLowerCase())) return 2;
          return 3;
        };
        return score(a) - score(b);
      })
      .slice(0, 50);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  searchContent
};