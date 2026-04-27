import { generateRandomId } from '../../utils';

// Function to create streaming sources
export const createStreaming = (matchData: any) => {
  return (
    matchData?.streaming_sources?.map((source: any) => {
      const headerObject: Record<string, string> = {};

      for (const item of source?.headers || []) {
        headerObject[item.key] = item.value;
      }
      return {
        id: generateRandomId(15),
        stream_title: source?.stream_title,
        stream_type: source?.stream_type,
        resolution: source?.resolution,
        platform: source?.platform,
        is_premium: source?.is_premium,
        portrait_watermark: source?.portrait_watermark,
        landscape_watermark: source?.landscape_watermark,
        stream_url: source?.stream_url,
        root_streams: source?.root_streams,
        headers: JSON.stringify(headerObject),
        stream_key: source?.stream_key,
        stream_status: source?.stream_status,
      };
    }) || []
  );
};
