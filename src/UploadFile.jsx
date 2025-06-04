import { useState, useEffect } from "react";
import { storage, databases, ID } from "./appwrite/appwriteConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const getFileEmoji = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  const fileIcons = {
    pdf: "📚",
    doc: "📚",
    docx: "📚",
    txt: "📚",
    xls: "📊",
    xlsx: "📊",
    csv: "📊",
    jpg: "🖼️",
    jpeg: "🖼️",
    png: "🖼️",
    gif: "🖼️",
    svg: "🖼️",
    bmp: "🖼️",
    webp: "🖼️",
    mp4: "🎥",
    avi: "🎥",
    mkv: "🎥",
    mov: "🎥",
    mp3: "🎥",
    wav: "🎥",
    ogg: "🎥",
  };

  return fileIcons[extension] || "📁";
};

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expiryHours, setExpiryHours] = useState(24);

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setUploadedFiles(savedFiles);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Max file size is 50MB.");
      return;
    }

    try {
      const result = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        "unique()",
        file
      );

      const fileId = result.$id;
      const expiresAt = new Date(
        Date.now() + expiryHours * 60 * 60 * 1000
      ).toISOString();

      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        fileId,
        expiresAt,
      });

      const url = storage.getFileView(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        fileId
      );

      const newFile = {
        name: file.name,
        url,
        type: file.type,
        date: new Date().toLocaleDateString(),
        expiresAt,
      };

      const updatedFiles = [...uploadedFiles, newFile];
      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file.");
    }
  };

  const handleCopyURL = (url) => {
    navigator.clipboard.writeText(url);
    toast.info("File URL copied to clipboard!");
  };

  const handleDeleteRecord = (indexToDelete) => {
    const updatedFiles = uploadedFiles.filter(
      (_, idx) => idx !== indexToDelete
    );
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    toast.warn("File record deleted.");
  };

  const isFileExpired = (expiresAt) => new Date(expiresAt) < new Date();

  return (
    <div className="container">
      <div className="logo-header">
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-icon"
        >
          <g>
            <path
              className="logo-path"
              d="M33.7164,21.7684c-1.6221-3.9371-5.4582-6.5073-9.7164-6.5102-4.2581,.0029-8.0943,2.5731-9.7164,6.5102"
            ></path>
            <path
              className="logo-path"
              d="M31.0383,21.7113c-1.4518-2.5144-4.1349-4.0633-7.0383-4.063-2.9034-.0003-5.5865,1.5485-7.0383,4.063"
            ></path>
            <path
              className="logo-path"
              d="M33.7988,29.6187c-.5654,2.11-2.6496,3.4379-4.8009,3.0585s-3.6557-2.34-3.4653-4.5161c.1904-2.1761,2.0124-3.8457,4.1969-3.8457l13.7705-.0431"
            ></path>
            <path className="logo-path" d="M28.4765,27.3356h10.0157"></path>
            <path
              className="logo-path"
              d="M14.2012,29.6187c.5654,2.11,2.6496,3.4379,4.8009,3.0585s3.6557-2.34,3.4653-4.5161c-.1904-2.1761-2.0124-3.8457-4.1969-3.8457l-13.7705-.0431"
            ></path>
            <path className="logo-path" d="M19.5225,27.3356H9.5068"></path>
          </g>
        </svg>
        <span className="logo-text">File Nest</span>
      </div>

      <div className="file-upload-wrapper">
        <input type="file" onChange={handleFileChange} />
      </div>
      <p className="info-text">
        Max file size: 50MB &nbsp;|&nbsp; Set expiry duration for public access
      </p>

      <div className="expiry-wrapper">
        <label htmlFor="expiry-select">Set Expiry:</label>{" "}
        <select
          id="expiry-select"
          value={expiryHours}
          onChange={(e) => setExpiryHours(Number(e.target.value))}
        >
          <option value={1}>1 Hour</option>
          <option value={3}>3 Hours</option>
          <option value={6}>6 Hours</option>
          <option value={12}>12 Hours</option>
          <option value={24}>1 Day</option>
        </select>
      </div>

      <button onClick={handleUpload} disabled={!file} className="upload-btn">
        Upload
      </button>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files-wrapper">
          <h3>Uploaded Files</h3>
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>File Type</th>
                <th>Upload Date</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => {
                const expired = isFileExpired(file.expiresAt);
                return (
                  <tr key={index} className={expired ? "expired" : ""}>
                    <td>
                      {getFileEmoji(file.name)} {file.name}
                    </td>
                    <td>{file.type || "N/A"}</td>
                    <td>{file.date}</td>
                    <td>
                      {expired ? (
                        <span className="expired-text">Expired</span>
                      ) : (
                        new Date(file.expiresAt).toLocaleString()
                      )}
                    </td>
                    <td>
                      {expired ? (
                        <>
                          <span className="expired-text">Link Expired</span> |{" "}
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteRecord(index)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>{" "}
                          |{" "}
                          <button
                            className="action-btn"
                            onClick={() => handleCopyURL(file.url)}
                          >
                            Copy URL
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default UploadFile;
