import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 232;
// Helper to pad the frame index
const getFramePath = (index: number) => {
  const paddedIndex = index.toString().padStart(3, '0');
  return `/frames/ezgif-frame-${paddedIndex}.webp`;
};

export default function HeroScrollAnimation({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // We map the scroll progress over the container to the frame index
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

  // Preload all frames on mount
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
        if (loaded === FRAME_COUNT) {
          // Draw the first frame once everything is loaded
          drawFrame(1);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Draw first frame if already cached
    if (images[0] && images[0].complete) {
      drawFrame(1);
    }
  }, []);

  // Update canvas when scroll changes
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const frame = Math.round(latest);
    requestAnimationFrame(() => drawFrame(frame));
  });

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    const img = imagesRef.current[index - 1];
    if (!img || !img.complete) return;

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    // Calculate "object-fit: cover" dimensions
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    // Apply a 1.15x scale factor to crop out the edges (hides the Veo watermark and any edge text)
    const scaleFactor = 1.15;
    const zoomedWidth = drawWidth * scaleFactor;
    const zoomedHeight = drawHeight * scaleFactor;

    // Recalculate offsets to keep it centered
    const zoomedOffsetX = offsetX - (zoomedWidth - drawWidth) / 2;
    const zoomedOffsetY = offsetY - (zoomedHeight - drawHeight) / 2;

    // Draw image
    ctx.drawImage(img, zoomedOffsetX, zoomedOffsetY, zoomedWidth, zoomedHeight);

    // Add a very subtle dark overlay for better text readability
    ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
    ctx.fillRect(0, 0, width, height);
  };

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      drawFrame(Math.round(frameIndex.get()));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-[#050505]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loading Spinner Removed */}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0"
          style={{ width: '100vw', height: '100vh' }}
        />

        {/* Foreground Content */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="pointer-events-auto h-full w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
