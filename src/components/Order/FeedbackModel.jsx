import { Button, Modal, Rate, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

function FeedbackModel({ mode, visible, close, submit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Report state
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const reportReasons = [
    { label: "Sản phẩm không đúng mô tả", value: "INCORRECT_DESCRIPTION" },
    { label: "Sản phẩm bị hư hỏng", value: "DAMAGED_PRODUCT" },
    { label: "Giao sai sản phẩm", value: "WRONG_PRODUCT" },
    { label: "Lý do khác", value: "OTHER" }
  ];

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (typeof url === "string") {
        setImages(prevImages => [...prevImages, url]);
      } else {
        console.error("Upload failed:", url?.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleRemove = (fileUrl) => {
    setImages(images.filter(url => url !== fileUrl));
  };

  const handleSubmit = () => {
    if (mode === "feedback") {
      submit({ rating, comment, images });
    } else if (mode === "report") {
      submit({ reason, description, images });
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setImages([]);
    setReason("");
    setDescription("");
  };

  const isSubmitDisabled = () => {
    if (mode === "feedback") return rating === 0;
    if (mode === "report") return !reason || !description;
    return false;
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
          disabled={isSubmitDisabled()}
        >
          Gửi
        </Button>,
      ]}
    >
      {mode === "feedback" ? (
        // Existing feedback modal content
        <>
          <div style={{ marginBottom: 16 }}>
            <p>Đánh giá sản phẩm</p>
            <Rate value={rating} onChange={setRating} />
          </div>

          <TextArea
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <div>
            <p>Thêm hình ảnh (tùy chọn):</p>
            <Upload
              beforeUpload={handleUpload}
              maxCount={5}
              listType="picture"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
                removeIcon: file => (
                  <button onClick={() => handleRemove(file.url || file.response)}>
                    Xóa
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
                disabled={images.length >= 5}
              >
                Tải hình ảnh
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
        // Report modal content
        <>
          <Select
            style={{ width: "100%", marginBottom: 10 }}
            value={reason}
            onChange={setReason}
            placeholder="Chọn lý do báo cáo"
            options={reportReasons}
          />
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết lý do báo cáo của bạn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <p className="mt-4">Hình ảnh minh chứng (tùy chọn):</p>
            <Upload
              beforeUpload={handleUpload}
              maxCount={3}
              listType="picture"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
                removeIcon: file => (
                  <button onClick={() => handleRemove(file.url || file.response)}>
                    Xóa
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
                disabled={images.length >= 3}
              >
                Tải hình ảnh
              </Button>
            </Upload>
          </div>

          {images.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {images.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`Report ${index + 1}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

export default FeedbackModel;