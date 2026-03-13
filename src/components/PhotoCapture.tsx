import { useRef, useCallback } from 'react';

interface PhotoCaptureProps {
  imageDataUrl: string | null;
  onImageSelected: (file: File) => void;
  onClear: () => void;
}

export function PhotoCapture({ imageDataUrl, onImageSelected, onClear }: PhotoCaptureProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageSelected(file);
    },
    [onImageSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) onImageSelected(file);
    },
    [onImageSelected],
  );

  if (imageDataUrl) {
    return (
      <div className="preview-container">
        <img src={imageDataUrl} alt="Food preview" />
        <div className="preview-actions">
          <button className="btn btn-sm btn-ghost" onClick={onClear}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="capture-section">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture
        onChange={handleFile}
        hidden
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        hidden
      />

      {/* Two big buttons for mobile */}
      <div className="capture-buttons">
        <button
          className="capture-btn capture-btn-primary"
          onClick={() => cameraInputRef.current?.click()}
        >
          <span className="capture-icon">&#x1F4F7;</span>
          <span>Take Photo</span>
        </button>
        <button
          className="capture-btn capture-btn-secondary"
          onClick={() => galleryInputRef.current?.click()}
        >
          <span className="capture-icon">&#x1F5BC;</span>
          <span>Gallery</span>
        </button>
      </div>

      {/* Drop zone for desktop */}
      <div
        className="drop-zone"
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
        onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
        onDrop={handleDrop}
        onClick={() => galleryInputRef.current?.click()}
      >
        <p>or drag & drop an image here</p>
      </div>
    </div>
  );
}
