import { FaPlus, FaTrash, FaStar } from "react-icons/fa";

const ReviewForm = ({ data, onChange }) => {
  const reviews = data.reviews || [];

  const addReview = () => {
    onChange("reviews", [
      ...reviews,
      {
        name: "",
        location: "",
        rating: 5,
        comment: "",
        date: new Date().toLocaleDateString("bn-BD"),
        avatar: "",
      },
    ]);
  };

  const updateReview = (index, field, value) => {
    const updated = [...reviews];
    updated[index][field] = value;
    onChange("reviews", updated);
  };

  const removeReview = (index) => {
    const updated = [...reviews];
    updated.splice(index, 1);
    onChange("reviews", updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-800">Customer Reviews</h3>
        <button
          onClick={addReview}
          className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1 px-3 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
        >
          <FaPlus size={12} /> Add Review
        </button>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">No reviews added. Click "Add Review" to create one.</p>
        </div>
      )}

      <div className="space-y-5">
        {reviews.map((review, idx) => (
          <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 relative bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Review #{idx + 1}
              </span>
              <button
                onClick={() => removeReview(idx)}
                className="text-red-400 hover:text-red-600 transition p-1"
              >
                <FaTrash size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Name *</label>
                <input
                  type="text"
                  value={review.name}
                  onChange={(e) => updateReview(idx, "name", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Location</label>
                <input
                  type="text"
                  value={review.location}
                  onChange={(e) => updateReview(idx, "location", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="e.g., Dhaka"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateReview(idx, "rating", star)}
                    className="focus:outline-none"
                  >
                    <FaStar className={`${star <= review.rating ? "text-yellow-400" : "text-gray-300"} text-xl`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Comment *</label>
              <textarea
                value={review.comment}
                onChange={(e) => updateReview(idx, "comment", e.target.value)}
                rows="2"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                placeholder="Customer review comment"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Date</label>
                <input
                  type="text"
                  value={review.date}
                  onChange={(e) => updateReview(idx, "date", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="১৫ মার্চ, ২০২৪"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Avatar URL</label>
                <input
                  type="text"
                  value={review.avatar}
                  onChange={(e) => updateReview(idx, "avatar", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="https://randomuser.me/api/portraits/..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewForm;