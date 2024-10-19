import React, { useState } from 'react';
import axios from 'axios';
import { UploadIcon } from 'lucide-react';
import './Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Bank Statement</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div>
          <label htmlFor="file" className="upload-label">
            Choose CSV file
          </label>
          <input
            type="file"
            id="file"
            accept=".csv"
            onChange={handleFileChange}
            className="upload-input"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : (
            <>
              <UploadIcon className="mr-2" />
              Upload
            </>
          )}
        </button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
};

export default Upload;