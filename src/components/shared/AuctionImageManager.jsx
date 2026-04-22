import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2Icon, PlusIcon, ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import ImageGallery from '@/components/ui/ImageGallery';
import { updateAuctionImages, deleteAuctionImage } from '@/api/auction.api';
import toast from 'react-hot-toast';

const AuctionImageManager = ({ auction, onImagesUpdated, className = '' }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const handleAddImages = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please select at least one image to upload');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();

      uploadedImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await updateAuctionImages(auction._id, formData);

      if (response.success) {
        toast.success(response.message || 'Images updated successfully');
        setIsDialogOpen(false);
        setUploadedImages([]);
        onImagesUpdated();
      } else {
        toast.error(response.message || 'Failed to add images');
      }
    } catch (error) {
      toast.error('Failed to add images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageIndex) => {
    try {
      setIsDeleting(imageIndex);
      const response = await deleteAuctionImage(auction._id, imageIndex);

      if (response.success) {
        toast.success(response.message || 'Image deleted successfully');
        onImagesUpdated();
      } else {
        toast.error(response.message || 'Failed to delete image');
      }
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(null);
    }
  };

  const images = auction.images || [];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-white">Product Images</CardTitle>
        <Button
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          disabled={images.length >= 10}
          className="!border-white/20 !text-white !bg-transparent hover:!bg-white/10 dark:!bg-transparent dark:!text-white dark:!border-white/20"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Images
        </Button>
      </CardHeader>

      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-400 mb-4">No images uploaded yet</p>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              className="!border-white/20 !text-white !bg-transparent hover:!bg-white/10 dark:!bg-transparent dark:!text-white dark:!border-white/20"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{images.length} of 10 images</span>
              <span>First image is primary</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={image.secureUrl || image.url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(index)}
                    disabled={isDeleting === index}
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Add Images Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-950 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Add Images to Auction</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400 mb-4">
                Upload additional images for your auction. Maximum {10 - images.length} more images can be added.
              </p>

              <ImageUpload
                images={uploadedImages}
                onImagesChange={setUploadedImages}
                maxImages={10 - images.length}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setUploadedImages([]);
                }}
                className="!border-white/20 !text-white !bg-transparent hover:!bg-white/10 dark:!bg-transparent dark:!text-white dark:!border-white/20"
              >
                Cancel
              </Button>

              <Button
                onClick={handleAddImages}
                disabled={isUploading || uploadedImages.length === 0}
              >
                {isUploading ? 'Uploading...' : 'Add Images'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AuctionImageManager;
