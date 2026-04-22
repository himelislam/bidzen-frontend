import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';

const ImageGallery = ({ images = [], className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') closeFullscreen();
  };

  return (
    <div className={`space-y-4 ${className}`} onKeyDown={handleKeyDown}>
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={images[currentIndex]?.secureUrl || images[currentIndex]?.url}
            alt={`Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openFullscreen}
          />
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              size="sm"
              variant="outline"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img
                src={image.secureUrl || image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <Button
            size="sm"
            variant="outline"
            className="absolute top-4 right-4"
            onClick={closeFullscreen}
          >
            <XIcon className="h-4 w-4" />
          </Button>

          <div className="relative max-w-6xl max-h-screen p-4">
            <img
              src={images[currentIndex]?.secureUrl || images[currentIndex]?.url}
              alt={`Fullscreen Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Fullscreen Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-2 rounded">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
