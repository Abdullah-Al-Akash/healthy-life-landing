const VideoForm = ({ data, onChange }) => {
  const video = data.video || { videoId: "", title: "", description: "" };

  // YouTube থাম্বনেইল URL জেনারেট
  const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return "";
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const updateVideo = (field, value) => {
    onChange("video", { ...video, [field]: value });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          YouTube Video ID <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={video.videoId || ""}
            onChange={(e) => updateVideo("videoId", e.target.value)}
            placeholder="e.g., dQw4w9WgXcQ"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
          />
          {video.videoId && (
            <div
              className="w-16 h-12 bg-cover bg-center rounded-lg border"
              style={{ backgroundImage: `url(${getYouTubeThumbnail(video.videoId)})` }}
            />
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          ⓘ YouTube ভিডিওর আইডি দিন (URL থেকে শেষ অংশ)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video Title
        </label>
        <input
          type="text"
          value={video.title || ""}
          onChange={(e) => updateVideo("title", e.target.value)}
          placeholder="e.g., আমাদের পণ্য সম্পর্কে জানুন"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video Description
        </label>
        <textarea
          value={video.description || ""}
          onChange={(e) => updateVideo("description", e.target.value)}
          rows="3"
          placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
        />
      </div>
    </div>
  );
};

export default VideoForm;