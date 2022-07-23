import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination,Thumbs } from "swiper";

export default function Carousel({ images }) {
  return (
    <Swiper
      height='500px'
      modules={[Navigation, Pagination,Thumbs]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {images?.map((image, index) => {
        return (
          <SwiperSlide key={index}>
            <img className='w-full h-full' src={image.url} alt=" "/>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
