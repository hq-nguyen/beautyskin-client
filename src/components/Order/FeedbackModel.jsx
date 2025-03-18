import { Button, Modal, Rate, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

function FeedbackModel({ mode, visible, close, submit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]); // Changed to array for multiple images
  const [uploading, setUploading] = useState(false);
  // report
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  // Handle image upload
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (typeof url === "string") {
        // Add the new image URL to the existing array
        setImages(prevImages => [...prevImages, url]);
      } else {
        console.error("Upload failed:", url?.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleRemove = (fileUrl) => {
    // Filter out the removed image
    setImages(images.filter(url => url !== fileUrl));
  };

  const handleSubmit = () => {
    if (mode === "feedback") {
      submit({ rating, comment, images }); // Pass images array instead of single image
    } else {
      submit({ reason, description });
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setImages([]);
    setReason("");
    setDescription("");
  };

  return (
    <Modal
      title={mode === "feedback" ? "Đánh giá sản phẩm" : "Báo cáo đơn hàng"}
      open={visible}
      onCancel={() => {
        resetForm();
        close();
      }}
      footer={[
        <Button key="cancel" onClick={close}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={mode === "feedback" && rating === 0}
        >
          Gửi
        </Button>,
      ]}
    >
      {mode === "feedback" ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <p>How would you rate this product?</p>
            <Rate value={rating} onChange={setRating} />
          </div>

          <TextArea
            rows={4}
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <div>
            <p>Add images (optional):</p>
            <Upload
              beforeUpload={handleUpload}
              maxCount={5} // Allow up to 5 images
              listType="picture"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
                removeIcon: file => (
                  <button onClick={() => handleRemove(file.url || file.response)}>
                    Remove
                  </button>
                )
              }}
              fileList={images.map((url, index) => ({
                uid: `image-${index}`,
                name: `Image ${index + 1}`,
                status: 'done',
                url: url,
              }))}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
                disabled={images.length >= 5} // Disable when max images reached
              >
                Upload Images
              </Button>
            </Upload>
          </div>

          {images.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {images.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`Feedback ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <Select
            style={{ width: "100%", marginBottom: 10 }}
            value={reason}
            onChange={setReason}
            placeholder="Select a reason"
            options={[
              { label: "Mistake", value: "Mistake" },
              { label: "Product is not good", value: "Product is not good" },
              { label: "Not in above", value: "Not in above" },
            ]}
          />
          <TextArea
            rows={4}
            placeholder="Leave your specific reasons here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      )}
    </Modal>
  );
}

export default FeedbackModel; 