import LiveMatch from "../../features/liveMatch/model";

export const getLiveMatchesForMobileService = async (): Promise<unknown[]> => {
  const pipeline = [
    { $sort: { position: 1 as 1 } },
    {
      $project: {
        _id: 0,
        mid: "$id",
        fid: "$fixture_id",
        l: { ln: "$league_name", li: "$league_image" },
        mi: { mt: "$match_title", mti: "$match_time", ih: "$is_hot" },
        tm: {
          t1: { n: "$team_one_name", img: "$team_one_image" },
          t2: { n: "$team_two_name", img: "$team_two_image" }
        }
      }
    }
  ];

  return LiveMatch.aggregate(pipeline).exec();
};
