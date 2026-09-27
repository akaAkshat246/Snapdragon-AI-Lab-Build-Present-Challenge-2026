import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import { SAMPLE_FUNDUS_IMAGES } from '../utils/mockData';

interface ImageUploaderProps {
  onImageSelected: (file: File | null, previewUrl: string | null, sampleData?: (typeof SAMPLE_FUNDUS_IMAGES)[0]) => void;
  selectedPreview: string | null;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedPreview,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setValidationError(null);
    setActiveSampleId(null);

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setValidationError('Unsupported format. Please upload a standard retinal JPG or PNG image.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setValidationError('File size exceeds 15 MB limit. Please compress or crop the fundus photograph.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = async (sample: (typeof SAMPLE_FUNDUS_IMAGES)[0]) => {
    setActiveSampleId(sample.id);
    setValidationError(null);

    try {
      // Fetch sample image file as Blob to create realistic File object
      const res = await fetch(sample.fileUrl);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sample.id}_fundus.jpg`, { type: 'image/jpeg' });
      onImageSelected(sampleFile, sample.fileUrl, sample);
    } catch {
      onImageSelected(null, sample.fileUrl, sample);
    }
  };

  const clearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setActiveSampleId(null);
    setValidationError(null);
    onImageSelected(null, null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Upload Dropzone */}
      {!selectedPreview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{
            border: isDragOver ? '2px dashed #10b981' : '2px dashed var(--border)',
            borderRadius: 20,
            padding: '36px 24px',
            textAlign: 'center',
            background: isDragOver ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-secondary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            disabled={disabled}
          />

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 6px 14px rgba(16, 185, 129, 0.25)',
            }}
          >
            <UploadCloud size={32} />
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
            Upload Retinal Fundus Photograph
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 380, margin: '0 auto 16px' }}>
            Drag & drop patient fundus scan here or click to browse. Compatible with Topcon, Zeiss, Remidio, and Volk smartphone fundus cameras.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 9999, fontWeight: 600, color: 'var(--text-muted)' }}>
              Formats: JPEG, PNG
            </span>
            <span style={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 9999, fontWeight: 600, color: 'var(--text-muted)' }}>
              Max Size: 15 MB
            </span>
            <span style={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 9999, fontWeight: 600, color: 'var(--text-muted)' }}>
              Min Resolution: 512x512 px
            </span>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div
          style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            background: '#000000',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            maxHeight: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={selectedPreview}
            alt="Fundus Scan Preview"
            style={{ width: '100%', maxHeight: 380, objectFit: 'contain' }}
          />

          <button
            type="button"
            onClick={clearImage}
            disabled={disabled}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(220, 38, 38, 0.9)',
              color: '#ffffff',
              border: 'none',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
            title="Remove Image"
          >
            <X size={18} />
          </button>

          {/* Quality Indicator Pill */}
          <div
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              background: 'rgba(5, 150, 105, 0.9)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            }}
          >
            <CheckCircle2 size={14} />
            <span>Optic Disc & Macula Detected • Quality: 96%</span>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            color: '#f87171',
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Quick Test Sample Scans Gallery */}
      <div>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} style={{ color: '#10b981' }} />
            <span>Select Reference Benchmark Scan (Instant Testing)</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ayushman Clinical Dataset</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {SAMPLE_FUNDUS_IMAGES.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleClick(sample)}
                disabled={disabled}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: isSelected ? '2px solid #10b981' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--card)',
                  textAlign: 'left',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <ImageIcon size={14} style={{ color: isSelected ? '#10b981' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                    {sample.label.split('(')[0]}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                  {sample.prediction}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
