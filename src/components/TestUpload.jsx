import React, { useState } from 'react'
import upload from '../lib/upload.js'

const TestUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const url = await upload(selectedFile)
      setUploadedUrl(url)
      console.log('✅ Upload successful:', url)
    } catch (err) {
      setError(err.message)
      console.error('❌ Upload failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>🧪 Test Image Upload</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileSelect}
          style={{ marginBottom: '10px' }}
        />
        
        {selectedFile && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>

      <button 
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </button>

      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          backgroundColor: '#ffebee',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ❌ Error: {error}
        </div>
      )}

      {uploadedUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>✅ Upload Successful!</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>URL:</strong> 
            <input 
              type="text" 
              value={uploadedUrl} 
              readOnly 
              style={{ 
                width: '100%', 
                padding: '5px',
                marginTop: '5px',
                fontSize: '12px'
              }} 
            />
          </div>
          <div>
            <strong>Preview:</strong>
            <br />
            <img 
              src={uploadedUrl} 
              alt="Uploaded" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px',
                marginTop: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TestUpload