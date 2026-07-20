import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Only src is required now
type HistoricalImage = { src: string };
interface HistoricalImagesCarouselProps {
  images: HistoricalImage[];
}

export const HistoricalImagesCarousel = ({ images }: HistoricalImagesCarouselProps) => {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {};
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Tarihi Görüntüler</h2>
      <Carousel className="max-w-3xl mx-auto" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative">
                <img 
                  src={image.src}
                  alt="Tarihten Kareler"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  style={{ maxHeight: '500px' }} 
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HistoricalImagesCarousel;
