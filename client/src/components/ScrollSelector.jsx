import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const WheelPicker = ({
  value,
  onChange,
  min = 5,
  max = 60,
  step = 5,
  unit = " questions",
  color = "orange",
  height = 200,
}) => {
  const values = [];
  for (let i = min; i <= max; i += step) values.push(i);

  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemHeight = 56;
  const visibleItems = 3;

  useEffect(() => {
    const idx = values.indexOf(value);
    if (idx >= 0) {
      setActiveIndex(idx);
    }
  }, [value, values]);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, index));

    if (values[clampedIndex] !== value) {
      setActiveIndex(clampedIndex);
      onChange(values[clampedIndex]);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const targetScroll = activeIndex * itemHeight;
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(
      0,
      Math.min(values.length - 1, activeIndex + delta)
    );

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onChange(values[newIndex]);
    }
  };

  const getItemOpacity = (index) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return 1;
    if (distance === 1) return 0.35;
    return 0;
  };

  const getItemScale = (index) => {
    const distance = Math.abs(index - activeIndex);
    if (distance === 0) return 1;
    if (distance === 1) return 0.8;
    return 0.7;
  };

  return (
    <div
      className="relative w-full bg-white rounded-3xl "
      style={{ height: visibleItems * itemHeight }}
    >
      {/* Center Selection Line - Top */}
      <div
        className="absolute left-0 right-0 h-px bg-gray-300 pointer-events-none z-20"
        style={{ top: itemHeight }}
      />

      {/* Center Selection Line - Bottom */}
      <div
        className="absolute left-0 right-0 h-px bg-gray-300 pointer-events-none z-20"
        style={{ top: itemHeight * 2 }}
      />

      {/* Top Fade */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="overflow-y-scroll no-scrollbar snap-y snap-mandatory h-full"
        style={{
          scrollSnapType: "y mandatory",
          paddingTop: itemHeight,
          paddingBottom: itemHeight,
        }}
      >
        {values.map((val, index) => {
          const isActive = index === activeIndex;
          const opacity = getItemOpacity(index);
          const scale = getItemScale(index);

          return (
            <div
              key={val}
              className="snap-center flex justify-center items-center"
              style={{ height: itemHeight }}
              onClick={() => {
                setActiveIndex(index);
                onChange(val);
              }}
            >
              <motion.div
                animate={{
                  scale,
                  opacity,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span
                  className={`font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-black text-3xl"
                      : "text-gray-400 text-xl"
                  }`}
                >
                  {val}
                </span>
                {isActive && (
                  <span className="text-black text-lg font-normal">
                    {unit.trim()}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default WheelPicker;
