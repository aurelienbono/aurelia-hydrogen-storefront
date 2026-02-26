import { useState } from 'react';
import { Image } from '@shopify/hydrogen';

interface ImageNode {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

interface ProductImageGalleryProps {
  images: ImageNode[];
  featuredImage?: ImageNode | null;
}

export function ProductImageGallery({ images, featuredImage }: ProductImageGalleryProps) {
  const allImages = featuredImage
    ? [featuredImage, ...images.filter((img) => img.id !== featuredImage.id)]
    : images;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = allImages[selectedIndex];

  if (!selectedImage) return null;

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-neutral-100 overflow-hidden">
        <Image
          data={selectedImage}
          aspectRatio="1"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover w-full h-full"
        />
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-colors ${
                i === selectedIndex ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image
                data={img}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
