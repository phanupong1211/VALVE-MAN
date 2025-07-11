import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PhotoCaptureProps {
  onPhotoCapture?: (file: File, timestamp: Date) => void;
  maxPhotos?: number;
  title?: string;
}

interface CapturedPhoto {
  id: string;
  file: File;
  url: string;
  timestamp: Date;
}

export function PhotoCapture({ onPhotoCapture, maxPhotos = 10, title = "Capture Photos" }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const timestamp = new Date();
        const photoId = `${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`;
        const url = URL.createObjectURL(file);
        
        const newPhoto: CapturedPhoto = {
          id: photoId,
          file,
          url,
          timestamp
        };

        setPhotos(prev => {
          if (prev.length >= maxPhotos) {
            return prev;
          }
          return [...prev, newPhoto];
        });

        onPhotoCapture?.(file, timestamp);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const photoToRemove = prev.find(p => p.id === photoId);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const openCamera = () => {
    setIsCapturing(true);
    fileInputRef.current?.click();
    setIsCapturing(false);
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {photos.length}/{maxPhotos} photos
            </span>
          </div>

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt="Captured"
                    className="w-full h-24 object-cover rounded-lg border border-border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(photo.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="absolute bottom-1 left-1 bg-background/80 backdrop-blur-sm rounded px-1 py-0.5">
                    <span className="text-xs text-foreground">
                      {photo.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Capture Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={openCamera}
              disabled={photos.length >= maxPhotos || isCapturing}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              {isCapturing ? 'Opening Camera...' : 'Take Photo'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= maxPhotos}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          {photos.length > 0 && (
            <div className="flex items-center text-sm text-success">
              <CheckCircle className="w-4 h-4 mr-2" />
              {photos.length} photo{photos.length !== 1 ? 's' : ''} captured with timestamps
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}