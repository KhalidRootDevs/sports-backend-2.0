import Highlight from "../../features/highlights/model";

export const getHighlightsForMobileService = async (page: number = 1, limit: number = 10): Promise<unknown> => {
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { status: "1" } },
    { $sort: { createdAt: -1 as -1 } },
    {
      $facet: {
        docs: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              id: "$_id",
              t: "$title",
              cat: "$category",
              lid: "$league_id",
              li: "$league_image",
              dt: "$date",
              sd: "$short_description",
              vt: "$video_type",
              yt: "$youtube_url",
              tt: "$thumbnail_type",
              hi: "$highlight_image",
              fid: "$fixture_id",
              vids: "$videos"
            }
          }
        ],
        total: [{ $count: "count" }]
      }
    }
  ];

  const [result] = await Highlight.aggregate(pipeline).exec();
  const totalDocs = result.total[0]?.count ?? 0;
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    docs: result.docs,
    totalDocs,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

export const getHighlightByIdForMobileService = async (id: string): Promise<unknown> => {
  return Highlight.findOne({ _id: id, status: "1" }, { __v: 0 }).lean();
};
