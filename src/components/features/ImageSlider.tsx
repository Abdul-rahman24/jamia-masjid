import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnjC_8tAszrA1dJss9FngGScnS23q7mCJW20V0gT2o5hJis1pLjOkzCEDPxf1e-DVtSvb--Whz4OY1E4EgyDF8JcB-9T7vATPFMPcxG2nL6smmTVCpjDP6LjEmBwiCxYJdhvcnqtredXEHt=w1200-h800-k-no', caption: 'Kattumavadi Masjid — Exterior View' },
  { src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmMwXZ0FXH8lEsxut-Lr5IRx34pwvjZAJSo2w3HPChZWRXWTYknPMqaPqlHTuwTIS4NDyIma_-T_vGzyFhVDA5YP0fBfRglRmIW7_NRp-Dr2Vlb5KI6_znzyFftsVSdvChSbqtT_kVVPDU=w1200-h800-k-no', caption: 'Kattumavadi Masjid — Side View' },
 
  { src: '/glimpses/media_1787715518978.jpg', caption: 'Community Event' },
  { src: '/glimpses/media_1787715518993.jpg', caption: 'Community Event' },
  { src: '/glimpses/media_1787715519004.jpg', caption: 'Community Gathering' },
  { src: '/glimpses/media_1787715519015.jpg', caption: 'Community Gathering' },
  { src: '/glimpses/media_1787715519020.jpg', caption: 'Community Gathering' },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const prev = () => setCurrent((p) => (p - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setCurrent((p) => (p + 1) % IMAGES.length);

  return (
    <div
      className="relative w-full h-72 sm:h-[420px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {IMAGES.map((img, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
        >
          <img
            src={img.src}
            alt={img.caption}
            className="w-full h-full object-cover"
            style={{ transform: idx === current ? 'scale(1.04)' : 'scale(1)', transition: 'transform 4.5s ease' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Caption + Counter */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-5 pb-5">
        <p className="text-white text-sm font-semibold drop-shadow-lg opacity-90">
          {IMAGES[current].caption}
        </p>
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold">
          <span className="text-amber-300">{current + 1}</span>
          <span className="opacity-50">/</span>
          <span>{IMAGES.length}</span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current ? 'bg-white w-6 h-2' : 'bg-white/40 w-2 h-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
