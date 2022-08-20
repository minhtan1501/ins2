import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

export default function Carousel({ images }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      simulateTouch={false}
    >
      {images?.map((image, index) => {
        return (
          <SwiperSlide key={index}>
            {
              image.url.endsWith('mp4') ? 
              <video controls className='w-full h-full ' src={image?.url} alt=" "/> :
              <img className='w-full h-full ' src={image?.url} alt=" "/> 

            }
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
