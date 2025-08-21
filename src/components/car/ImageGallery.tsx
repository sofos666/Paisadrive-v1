import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

interface ImageGalleryProps {
  imageUrls: string[];
}

export function ImageGallery({ imageUrls }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No hay imágenes</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card>
        <CardContent className="p-0 relative">
          <div className="relative group">
            <img 
              src={imageUrls[currentImageIndex]} 
              alt={`Car image ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
            />
            
            {/* Navigation buttons - only show if more than 1 image */}
            {imageUrls.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Fullscreen button */}
            <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={imageUrls[currentImageIndex]} 
                    alt={`Car image ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Fullscreen navigation */}
                  {imageUrls.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white border-white/40"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white border-white/40"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}

                  {/* Close button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white border-white/40"
                    onClick={() => setIsFullscreenOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} de {imageUrls.length}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Image counter overlay */}
            {imageUrls.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail navigation - only show if more than 1 image */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img 
                src={url} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}