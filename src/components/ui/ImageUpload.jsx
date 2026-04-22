import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XIcon, UploadIcon, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 10, 
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }

      // Check file size
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }

      // Check total images limit
      if (images.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles]);
    }
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div
              className={`text-center cursor-pointer ${dragActive ? 'bg-blue-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600">
                <p className="font-medium">Drop images here or click to upload</p>
                <p className="text-xs mt-1">
                  PNG, JPG, GIF up to 5MB each (max {maxImages} images)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : image instanceof File ? (
                    // For local file previews
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>

                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Count */}
      <div className="text-sm text-gray-500">
        {images.length} of {maxImages} images uploaded
      </div>
    </div>
  );
};

export default ImageUpload;
