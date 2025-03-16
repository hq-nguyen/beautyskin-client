import { Button, Modal, Rate, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

function FeedbackModel({ mode, visible, close, submit }) {

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  // report
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState(0);

  // Handle image upload
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (typeof url === "string") {
        setImage(url);
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

  const handleSubmit = () => {
    if (mode == "feedback") {
      submit({ rating, comment, image });
    } else {
      submit({ reason, description });
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setImage("");
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
          disabled={rating === 0}
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
            <p>Add an image (optional):</p>
            <Upload
              beforeUpload={handleUpload}
              maxCount={1}
              listType="picture"
              showUploadList={true}
              onRemove={() => setImage("")}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                {image ? "Change Image" : "Upload Image"}
              </Button>
            </Upload>
          </div>

          {image && (
            <div style={{ marginTop: 16 }}>
              <img
                src={image}
                alt="Feedback"
                style={{ maxWidth: "100%", maxHeight: 200 }}
              />
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
              { label: "spam", value: "Mistake" },
              { label: "fake", value: "Product is not good" },
              { label: "orther", value: "Not in above" },
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