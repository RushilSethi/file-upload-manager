import { useState, useEffect } from 'react';
import storage from './appwrite/appwriteConfig';

const getFileEmoji = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();

  const fileIcons = {
    pdf: '📚',
    doc: '📚',
    docx: '📚',
    txt: '📚',
    xls: '📊',
    xlsx: '📊',
    csv: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    svg: '🖼️',
    bmp: '🖼️',
    webp: '🖼️',
    mp4: '🎥',
    avi: '🎥',
    mkv: '🎥',
    mov: '🎥',
    mp3: '🎥',
    wav: '🎥',
    ogg: '🎥',
  };

  return fileIcons[extension] || '📁';
};

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    setUploadedFiles(savedFiles);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    try {
      const result = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        'unique()',
        file
      );

      const url = storage.getFileView(import.meta.env.VITE_APPWRITE_BUCKET_ID, result.$id);
      const newFile = {
        name: file.name,
        url,
        type: file.type,
        date: new Date().toLocaleDateString(),
      };

      const updatedFiles = [...uploadedFiles, newFile];
      setUploadedFiles(updatedFiles);
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      alert('File uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  const handleCopyURL = (url) => {
    navigator.clipboard.writeText(url);
    alert('File URL copied to clipboard!');
  };

  return (
    <div className="container">
      <h2>File Upload and Manage</h2>

      <div className="file-upload-wrapper">
        <input type="file" onChange={handleFileChange} />
      </div>
      <br />
      <button onClick={handleUpload}>Upload</button>

      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploaded Files</h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>File Type</th>
                  <th>Upload Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>
                      {getFileEmoji(file.name)} {file.name}
                    </td>
                    <td>{file.type}</td>
                    <td>{file.date}</td>
                    <td>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>{' '}
                      |{' '}
                      <button
                        className="action-btn"
                        onClick={() => handleCopyURL(file.url)}
                      >
                        Copy URL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
