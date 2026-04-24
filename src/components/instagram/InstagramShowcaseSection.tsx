import { getInstagramFeed } from '@/lib/instagram';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Instagram, RefreshCcw, Sparkles } from 'lucide-react';
import { useMemo, useRef } from 'react';

import InstagramMediaCard from './InstagramMediaCard';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function InstagramSectionSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      <div className="col-span-2 aspect-[4/4.8] animate-pulse rounded-[2rem] border border-white/8 bg-white/[0.03]" />
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="aspect-[4/5] animate-pulse rounded-[2rem] border border-white/8 bg-white/[0.03]"
        />
      ))}
    </div>
  );
}

function InstagramFallback() {
  return (
    <div className="luxe-panel relative overflow-hidden px-6 py-10 md:px-10">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_58%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Instagram className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-3xl text-white md:text-4xl">Follow the latest couture drops</h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 md:text-base">
            Instagram is being shy right now, but the layout will stay intact. Explore the live profile
            for fresh reels, fittings, and bespoke bridal details.
          </p>
        </div>

        <a
          href="https://www.instagram.com/yaga_designs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 self-start rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-6 py-3 text-sm font-medium uppercase tracking-[0.24em] text-[#F6D189] transition-colors duration-300 hover:bg-[#D4AF37]/15"
        >
          Follow us on Instagram
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export default function InstagramShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['instagram-feed'],
    queryFn: getInstagramFeed,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 20 * 60 * 1000,
    retry: 1,
  });

  const featuredPost = data?.featured_post ?? data?.posts?.[0] ?? null;
  const secondaryPosts = useMemo(
    () =>
      (data?.posts ?? [])
        .filter((post) => post.id !== featuredPost?.id)
        .slice(0, 6),
    [data?.posts, featuredPost?.id],
  );
  const reels = useMemo(
    () =>
      (data?.reels ?? [])
        .filter((post) => post.id !== featuredPost?.id)
        .slice(0, 3),
    [data?.reels, featuredPost?.id],
  );

  const syncedLabel = data?.last_fetched_at
    ? `Synced ${formatDistanceToNow(new Date(data.last_fetched_at), { addSuffix: true })}`
    : 'Synced every hour';

  const shouldShowFallback = (isError || !data?.posts?.length) && !isLoading;

  return (
    <section
      ref={sectionRef}
      className="site-section relative overflow-hidden px-0 py-28 md:py-32"
      id="instagram-showcase"
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y: backdropY }}
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
      >
        <div className="absolute left-1/2 top-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#D4AF37]/8 blur-[140px]" />
        <div className="absolute right-0 top-1/4 h-[22rem] w-[22rem] rounded-full bg-[#8B5E2D]/14 blur-[130px]" />
      </motion.div>

      <div className="container relative z-10">
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="section-kicker mb-5">
              <Instagram className="h-4 w-4 text-[#D4AF37]" />
              Instagram Showcase
            </span>
            <h2 className="font-heading text-4xl leading-[0.95] text-white md:text-6xl lg:text-7xl">
              The atelier
              <br />
              <span className="text-gradient italic">in motion</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/56 md:text-base">
              A curated window into YAGA Designs: new couture drops, bridal fittings, and reel moments,
              served from a private backend cache so the experience stays smooth and dependable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="luxe-panel max-w-md px-5 py-5 md:px-6"
          >
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-[#F6D189]/78">
              <RefreshCcw className="h-4 w-4" />
              {syncedLabel}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-white">@{data?.username || 'yaga_designs'}</p>
                <p className="mt-1 text-sm text-white/45">
                  Backend-polled hourly with safe cached delivery to the frontend.
                </p>
              </div>

              <a
                href={data?.profile_url || 'https://www.instagram.com/yaga_designs/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/72 transition-colors duration-300 hover:text-[#F6D189]"
              >
                Profile
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {isLoading ? <InstagramSectionSkeleton /> : null}
        {shouldShowFallback ? <InstagramFallback /> : null}

        {!isLoading && !shouldShowFallback && featuredPost ? (
          <>
            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
            >
              <motion.div variants={itemVariants} className="col-span-2">
                <InstagramMediaCard post={featuredPost} featured priority />
              </motion.div>

              {secondaryPosts.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <InstagramMediaCard post={post} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="mt-6"
            >
              <div className="luxe-panel flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-sm text-white/55">
                  <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                  {data?.stale
                    ? 'Showing the latest cached posts while Instagram finishes the next refresh.'
                    : 'Freshly synced from the backend cache for a stable, polished showcase.'}
                </div>
                <a
                  href={featuredPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[#F6D189] transition-opacity duration-300 hover:opacity-100"
                >
                  View latest post
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            {reels.length > 0 ? (
              <div className="mt-14 md:mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.75 }}
                  className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]/75">Reel Highlights</p>
                    <h3 className="mt-2 font-heading text-3xl text-white md:text-4xl">Moving silhouettes, not static cards</h3>
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-white/48">
                    Video posts get their own spotlight, with muted hover previews that preserve layout and stay out
                    of the way on touch devices.
                  </p>
                </motion.div>

                <motion.div
                  variants={gridVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
                >
                  {reels.map((reel, index) => (
                    <motion.div key={reel.id} variants={itemVariants}>
                      <InstagramMediaCard post={reel} priority={index === 0} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
