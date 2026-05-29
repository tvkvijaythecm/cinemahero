import dynamic from 'next/dynamic';
import VideoIntro from '@/components/VideoIntro/VideoIntro';

const Cursor = dynamic(() => import('@/components/Cursor/Cursor'), { ssr: false });

export default function Home() {
  return (
    <>
      <Cursor />
      <main>
        {/* Hero — place your video at /public/video/hero.mp4 */}
        <VideoIntro videoSrc="/video/hero.mp4" />

        {/* Work section — replace with your content */}
        <section id="next-section" className="next-section">
          Work &amp; Projects
        </section>
      </main>
    </>
  );
}
