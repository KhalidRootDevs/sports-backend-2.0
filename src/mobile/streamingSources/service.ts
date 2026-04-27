import Stream from "../../features/stream/model";

export const getStreamingSourcesForMobileService = async (matchId: number): Promise<unknown[]> => {
  const pipeline = [
    { $match: { match_id: matchId, stream_status: true } },
    { $sort: { position: 1 as 1 } },
    {
      $project: {
        _id: 0,
        sid: "$id",
        t: "$stream_title",
        ip: "$is_premium",
        res: "$resolution",
        plt: "$platform",
        st: "$stream_type",
        pw: "$portrait_watermark",
        lw: "$landscape_watermark",
        rs: "$root_streams",
        url: "$stream_url",
        hdr: "$headers",
        sk: "$stream_key"
      }
    }
  ];

  return Stream.aggregate(pipeline).exec();
};
