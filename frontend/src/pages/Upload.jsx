import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { UploadCloud, CheckCircle, Image as ImageIcon, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function Upload() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roomId = params.get("room");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", roomId);
    }
  }, [roomId]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!roomId) {
      toast.error("Valid Room ID is required!");
      return;
    }

    setUploading(true);
    setProgress(0);
    setSuccess(false);

    const formData = new FormData();
    for (let file of files) {
      formData.append("images", file);
    }
    formData.append("roomId", roomId);

    try {
      const hostname = window.location.hostname;
      const apiUrl = import.meta.env.VITE_API_URL || `http://${hostname}:5000`;
      
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success("Images uploaded successfully!");
      } else {
        toast.error("Upload failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server.");
    } finally {
      setUploading(false);
      // Reset input manually so they can fire `onChange` again for the same file if needed
      e.target.value = null;
    }
  };

  if (!roomId) {
    return (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "2rem", background: 'var(--background)' }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)", maxWidth: '400px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1rem', borderRadius: '1rem', display: 'inline-flex', marginBottom: '1.5rem' }}>
            <X size={32} color="#EF4444" />
          </div>
          <h2 style={{ color: 'var(--text)', marginBottom: '0.75rem' }}>Invalid session</h2>
          <p style={{ lineHeight: '1.6' }}>The scan session has expired or is invalid. Please return to the desktop dashboard and generate a new QR code.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
            style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', borderRadius: '12px' }}
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "1.5rem", background: 'var(--background)' }}>
      <div style={{ 
        background: "var(--surface)", 
        padding: "2rem 1.5rem", 
        borderRadius: "1.5rem", 
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.25rem",
        position: 'relative'
      }}>
        
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            background: 'var(--surfaceL)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text)',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surfaceL)'}
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>

        <div style={{ textAlign: "center", color: 'var(--text)', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '0.8rem', borderRadius: '1rem', display: 'inline-flex', marginBottom: '1rem' }}>
            <UploadCloud size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Start Upload</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Ready to send images to your dashboard.
          </p>
        </div>

        <div style={{ width: "100%" }}>
          {/* Custom File Input Styling */}
          <label 
            className="btn-primary"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px", 
              width: "100%", 
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1
            }}
          >
            <ImageIcon size={20} />
            {uploading ? "Uploading..." : "Select Images"}
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleUpload} 
              style={{ display: "none" }} 
              disabled={uploading}
            />
          </label>
        </div>

        {uploading && (
          <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--textA)' }}>
              <span>Uploading</span>
              <span>{progress}%</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "var(--primary)", transition: "width 0.2s" }} />
            </div>
          </div>
        )}

        {success && !uploading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 16px', borderRadius: '8px', width: '100%', justifyContent: 'center' }}>
            <CheckCircle size={20} />
            <span style={{ fontWeight: 500 }}>Upload Complete!</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default Upload;
