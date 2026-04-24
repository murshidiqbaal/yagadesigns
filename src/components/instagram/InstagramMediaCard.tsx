import type { InstagramPost } from '@/lib/instagram';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Clapperboard, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface InstagramMediaCardProps {
  post: InstagramPost;
  className?: string;
  featured?: boolean;
  priority?: boolean;
}

export default function InstagramMediaCard({
  post,
  className,
  featured = false,
  priority = false,
}: InstagramMediaCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (post.media_type !== 'video') {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    // Only wake the preview video during intentional hover so the grid stays light.
    if (isHovered && !prefersReducedMotion) {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [isHovered, post.media_type, prefersReducedMotion]);

  return (
    <motion.a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative block overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0a08] shadow-[0_24px_80px_rgba(0,0,0,0.35)]',
        className,
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -8,
            }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          featured ? 'aspect-[4/4.8] sm:aspect-[5/6]' : 'aspect-[4/5]',
        )}
      >
        <img
          src={post.preview_url || post.media_url}
          alt={post.caption || 'Latest work from Yaga Designs on Instagram'}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />

        {post.media_type === 'video' ? (
          <video
            ref={videoRef}
            src={post.media_url}
            poster={post.preview_url || post.media_url}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
              isHovered && !prefersReducedMotion ? 'opacity-100' : 'opacity-0',
            )}
          />
        ) : null}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.05)_0%,rgba(5,4,3,0.2)_45%,rgba(5,4,3,0.78)_100%)]" />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
          <div className="flex items-center gap-2">
            {post.is_new ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F6D189]/30 bg-[#F6D189]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F6D189] shadow-[0_0_30px_rgba(246,209,137,0.18)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F6D189]/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F6D189]" />
                </span>
                New
              </span>
            ) : null}
          </div>

          {post.media_type === 'video' ? (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[#F6D189] backdrop-blur-md">
              <Clapperboard className="h-4 w-4" />
            </span>
          ) : null}
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="inline-flex translate-y-4 items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/90 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View on Instagram
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#F6E8C6]/70">
            <span>{post.media_type === 'video' ? 'Reel' : 'Post'}</span>
            <span className="h-px w-10 bg-[#D4AF37]/40" />
            <span>@yaga_designs</span>
          </div>

          {featured && post.caption ? (
            <p className="max-w-sm text-sm leading-relaxed text-white/78 line-clamp-3 md:text-base">
              {post.caption}
            </p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-white/72">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              Curated from the latest atelier moments
            </p>
          )}
        </div>
      </div>
    </motion.a>
  );
}
