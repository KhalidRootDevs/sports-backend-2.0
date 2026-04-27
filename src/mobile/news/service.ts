import News from "../../features/news/model";

export const getNewsForMobileService = async (page: number = 1, limit: number = 10): Promise<unknown> => {
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
              src: "$source_name",
              lid: "$league_id",
              li: "$league_image",
              sl: "$slug",
              url: "$url",
              img: "$image",
              desc: "$description",
              dt: "$publish_date"
            }
          }
        ],
        total: [{ $count: "count" }]
      }
    }
  ];

  const [result] = await News.aggregate(pipeline).exec();
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
