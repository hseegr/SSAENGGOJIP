import { useRef, useEffect } from "react";

declare global {
    interface Window {
        kakao: any;
    }
}

const KakaoMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapRef.current && window.kakao) {
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };
            const map = new window.kakao.maps.Map(mapRef.current, options);

            // 화면 크기가 변경될 때 지도를 재정렬
            const handleResize = () => {
                map.relayout();
            };

            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    return (
        <div
            id="map"
            ref={mapRef}
            style={{
                width: "100vw",
                height: "100vh",
                margin: "0",
                padding: "0",
                position: "relative",
                top: "0",
                left: "0",
            }}
        />
    );
};

export default KakaoMap;
