import React, { useEffect, useState } from "react";
// Import QRCode as a named import to avoid CJS/ESM interop issues with Vite
import { QRCode } from "react-qr-code";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../socket";
import { Copy, UploadCloud, Smartphone, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Desktop = () => {
  const navigate = useNavigate();
  const [roomId] = useState(uuidv4());
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isMobileConnected, setIsMobileConnected] = useState(false);
  
  // Assuming the Vite frontend runs on port 5173
  const frontendUrl = window.location.origin;
  const qrUrl = `${frontendUrl}/qr-upload?room=${roomId}`;

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("device-joined", () => {
      setShowModal(false);
      setIsMobileConnected(true);
      toast.success("Mobile device paired!", { icon: '📱' });
    });

    socket.on("receive-images", (newImages) => {
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) received!`);
    });

    return () => {
      socket.off("device-joined");
      socket.off("receive-images");
    };
  }, [roomId]);

  const copyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: '2.5rem',
        padding: '0 1rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.4rem 0.8rem',
              background: 'var(--surfaceL)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              width: 'fit-content',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--border)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--surfaceL)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', margin: 0 }}>QR Image Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '1rem' }}>Transfer images instantly to your gallery.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.9rem', 
            fontWeight: 500, 
            color: isMobileConnected ? 'var(--primary)' : 'var(--text-muted)' 
          }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: isMobileConnected ? 'var(--primary)' : '#e2e8f0',
              boxShadow: isMobileConnected ? '0 0 10px rgba(var(--primary-rgb, 37, 99, 235), 0.5)' : 'none',
              animation: isMobileConnected ? 'pulse 2s infinite' : 'none'
            }} />
            {isMobileConnected ? 'Device Paired' : 'Not Connected'}
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '1rem 2rem',
              borderRadius: '14px',
              fontSize: '1.05rem',
              fontWeight: 600,
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Smartphone size={22} /> QR Upload
          </button>
        </div>
      </header>

      {/* Main Gallery Area */}
      <div style={{ 
        background: 'var(--surface)', 
        borderRadius: '2rem', 
        padding: '2.5rem', 
        minHeight: '45vh',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text)', fontWeight: 700 }}>Gallery ({images.length})</h2>
          {images.length > 0 && (
            <button 
              onClick={() => setImages([])} 
              style={{ 
                fontSize: '0.95rem', 
                color: '#ef4444', 
                background: 'rgba(239, 68, 68, 0.08)', 
                border: 'none', 
                padding: '0.6rem 1.4rem',
                borderRadius: '10px',
                cursor: 'pointer', 
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
            >
              Clear All
            </button>
          )}
        </div>

        {images.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '45vh',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              background: 'var(--surfaceL)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '2.5rem',
              border: '1px solid var(--border)',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.02)'
            }}>
              <UploadCloud size={64} style={{ opacity: 0.3, color: 'var(--primary)' }} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.8rem' }}>Ready for Your Content</p>
            <p style={{ fontSize: '1.1rem', maxWidth: '400px', lineHeight: '1.6' }}>
              Click the <strong style={{ color: 'var(--primary)' }}>QR Upload</strong> button to generate a secure link and start transferring images.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: '2rem'
          }}>
            {images.map((img, i) => (
              <div key={i} style={{ 
                padding: '0', 
                overflow: 'hidden', 
                height: '300px', 
                position: 'relative', 
                borderRadius: '24px',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                background: 'var(--surfaceL)'
              }}>
                <img 
                  src={img} 
                  alt={`Received ${i}`} 
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                  }} 
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal Popup */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={() => setShowModal(false)}>
          <div 
            style={{
              background: 'var(--surface)',
              padding: '3rem 2.5rem',
              borderRadius: '2.5rem',
              maxWidth: '460px',
              width: '100%',
              position: 'relative',
              textAlign: 'center',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.1), 0 18px 36px -18px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--border)',
              animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                background: 'var(--surfaceL)', 
                border: '1px solid var(--border)', 
                color: 'var(--text)', 
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(90deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0)'}
            >
              <X size={18} />
            </button>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                 <div style={{ padding: '0.8rem', background: 'rgba(37, 99, 235, 0.08)', borderRadius: '1.25rem' }}>
                  <Smartphone size={28} />
                </div>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text)' }}>Scan to Connect</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                Scan with your camera to start uploading.
              </p>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '1.2rem', 
              borderRadius: '1.5rem', 
              display: 'inline-block', 
              marginBottom: '1.25rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9'
            }}>
              <QRCode value={qrUrl} size={180} fgColor="#0f172a" />
            </div>

            <div style={{ 
              background: 'rgba(255, 191, 0, 0.06)', 
              border: '1px solid rgba(255, 191, 0, 0.15)', 
              padding: '8px 12px', 
              borderRadius: '10px', 
              marginBottom: '1.25rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ minWidth: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
              <p style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 500, margin: 0 }}>
                Both devices must be in the <strong>same network</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="btn-secondary" 
                onClick={copyLink} 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  padding: '0.8rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <Copy size={16} /> Copy Direct Link
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default Desktop;
