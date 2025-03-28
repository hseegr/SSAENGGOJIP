import React from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 화살표 버튼의 props 타입 정의
interface ArrowProps {
    onClick?: () => void; // 클릭 이벤트 핸들러
  }

  
  
  
  const LazyLoadSlider = ({ imageUrls }) => {
      // Custom Next Arrow (Lucide Icon 사용)
      const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
          return (
            <button
              onClick={onClick}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black p-2 rounded-full z-10"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          );
        };
      // Custom Prev Arrow (Lucide Icon 사용)
      const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
        return (
          <button
            onClick={onClick}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black p-2 rounded-full z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
        );
      };
      const defaultImage = "/src/assets/react.svg"; // 기본 이미지 경로

  const settings = {
    // dots: true, // 하단 점 표시
    lazyLoad: "ondemand", // Lazy Load 활성화 ('ondemand' 또는 'progressive')
    infinite: true, // 무한 반복
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 수
    nextArrow: <NextArrow />, // 커스텀 Next Arrow
    prevArrow: <PrevArrow />, // 커스텀 Prev Arrow
  };

  return (
    <div className="slider-container w-full h-[200px] relative">
      <Slider {...settings}>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                className="w-full h-[200px] object-cover rounded-md"
                onError={(e) => (e.target.src = defaultImage)} // 이미지 로드 실패 시 기본 이미지 표시
              />
            </div>
          ))
        ) : (
          <div>
            <img
              src={defaultImage}
              alt="Default"
              className="w-full h-[200px] object-cover rounded-md"
            />
          </div>
        )}
      </Slider>
    </div>
  );
};

export default LazyLoadSlider;
