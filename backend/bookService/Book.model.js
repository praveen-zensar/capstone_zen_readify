import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: "text" },
    author: { type: String, required: true, index: "text" },
    genre: { type: String, required: true },
    category: {
      type: String,
      enum: ["best-seller", "new-arrival", "editors-pick"],
      default: "new-arrival",
    },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

// Compound text index for search
bookSchema.index({ title: "text", author: "text" });

const BooksModel = mongoose.model("Book", bookSchema);
export default BooksModel;
