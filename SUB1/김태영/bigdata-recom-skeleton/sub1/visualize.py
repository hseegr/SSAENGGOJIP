import itertools
import folium
import webbrowser
from collections import Counter
from parse import load_dataframes
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from folium.plugins import MarkerCluster

def set_config():
    # 폰트, 그래프 색상 설정
    font_list = fm.findSystemFonts(fontpaths=None, fontext="ttf")
    if any(["notosanscjk" in font.lower() for font in font_list]):
        plt.rcParams["font.family"] = "Noto Sans CJK JP"
    else:
        if not any(["malgun" in font.lower() for font in font_list]):
            raise Exception(
                "Font missing, please install Noto Sans CJK or Malgun Gothic. If you're using ubuntu, try `sudo apt install fonts-noto-cjk`"
            )

        plt.rcParams["font.family"] = "Malgun Gothic"

    sns.set_palette(sns.color_palette("Spectral"))
    plt.rc("xtick", labelsize=6)


def show_store_categories_graph(dataframes, n=100):
    """
    Tutorial: 전체 음식점의 상위 `n`개 카테고리 분포를 그래프로 나타냅니다.
    """

    stores = dataframes["stores"]

    # 모든 카테고리를 1차원 리스트에 저장합니다
    categories = stores.category.apply(lambda c: c.split("|"))
    categories = itertools.chain.from_iterable(categories)

    # 카테고리가 없는 경우 / 상위 카테고리를 추출합니다
    categories = filter(lambda c: c != "", categories)
    categories_count = Counter(list(categories))
    best_categories = categories_count.most_common(n=n)
    df = pd.DataFrame(best_categories, columns=["category", "count"]).sort_values(
        by=["count"], ascending=False
    )

    # 그래프로 나타냅니다
    chart = sns.barplot(x="category", y="count", data=df)
    chart.set_xticklabels(chart.get_xticklabels(), rotation=45)
    plt.title("음식점 카테고리 분포")
    plt.show()


def show_store_review_distribution_graph():
    """
    Req. 1-3-1 전체 음식점의 리뷰 개수 분포를 그래프로 나타냅니다. 
    """
    # 데이터 불러오기
    dataframes = load_dataframes()
    
    # 음식점별 리뷰 개수 계산
    review_counts = dataframes["reviews"].groupby("store").size()
    
    # 그래프 그리기
    plt.figure(figsize=(10, 6))
    sns.histplot(review_counts, bins=50, kde=False, color="#FEE08B", edgecolor="black")
    plt.xlabel("리뷰 개수")
    plt.ylabel("음식점 수")
    plt.title("음식점별 리뷰 개수 분포")
    plt.grid(True)
    
    # 그래프 출력
    plt.show()



def show_store_average_ratings_graph():
    """
    Req. 1-3-2 각 음식점의 평균 평점을 그래프로 나타냅니다.
    """
    # 데이터 불러오기
    dataframes = load_dataframes()
    
    # 음식점별 평균 평점 계산
    store_ratings = dataframes["reviews"].groupby("store")["total_score"].mean()
    
    # 그래프 그리기
    plt.figure(figsize=(10, 6))
    sns.histplot(store_ratings, bins=30, kde=False, color="#ABDDA4", edgecolor="black", alpha=0.7)
    plt.xlabel("평균 평점")
    plt.ylabel("음식점 수")
    plt.title("음식점별 평균 평점 분포")
    plt.grid(True)
    
    # 그래프 출력
    plt.show()


def show_user_review_distribution_graph(dataframes):
    """
    Req. 1-3-3 전체 유저의 리뷰 개수 분포를 그래프로 나타냅니다.
    """
    # 유저별 리뷰 개수 계산
    user_review_counts = dataframes["reviews"].groupby("user").size()
    
    # 그래프 그리기
    plt.figure(figsize=(10, 6))
    sns.histplot(user_review_counts, bins=50, kde=False, color="#3288BD", edgecolor="black")
    plt.xlabel("리뷰 개수")
    plt.ylabel("유저 수")
    plt.title("유저별 리뷰 개수 분포")
    plt.grid(True)
    
    # 그래프 출력
    plt.show()


def show_user_age_gender_distribution_graph(dataframes):
    """
    Req. 1-3-4 전체 유저의 성별/나이대 분포를 그래프로 나타냅니다.
    """
    user_data = dataframes["users"]
    user_data["age_group"] = (user_data["age"] // 10) * 10  # 연령대를 10년 단위로 분류
    
    plt.figure(figsize=(10, 6))
    sns.histplot(data=user_data, x="age_group", hue="gender", multiple="stack", bins=8, kde=False, color="#66C2A5", edgecolor="black")
    plt.xlabel("나이대")
    plt.ylabel("유저 수")
    plt.title("유저 성별/나이대 분포")
    plt.grid(True)
    plt.show()


def show_stores_distribution_graph(dataframes):
    """
    Req. 1-3-5 각 음식점의 위치 분포를 지도에 나타냅니다.
    """
    # """
    # - 강남에 있는 음식점만 필터링
    # - 리뷰 수 10개 이상, 평점 4.0점 이상인 음식점만 표시
    # """

    # stores = dataframes["stores"]
    # reviews = dataframes["reviews"]

    # # 강남에 있는 음식점 필터링
    # gangnam_stores = stores[stores["area"].str.contains("강남", na=False)]

    # # 음식점별 평균 평점 및 리뷰 개수 계산
    # review_stats = reviews.groupby("store").agg(
    #     avg_score=("total_score", "mean"), review_count=("id", "count")
    # ).reset_index()

    # # 강남 음식점과 리뷰 통계를 병합
    # gangnam_stores = gangnam_stores.merge(review_stats, left_on="id", right_on="store", how="left")

    # # 평점 4.0 이상 & 리뷰 수 10개 이상인 음식점 필터링
    # selected_stores = gangnam_stores[(gangnam_stores["avg_score"] >= 4.0) & (gangnam_stores["review_count"] >= 10)]

    # # 데이터 확인: 선택된 음식점 개수 출력
    # print(f"선택된 음식점 개수: {len(selected_stores)}")
    # print(selected_stores[["store_name", "latitude", "longitude", "avg_score", "review_count"]].head())

    # # Folium 지도 생성 (강남역 중심 좌표)
    # gangnam_map = folium.Map(location=[37.4979, 127.0276], zoom_start=13)

    # # 마커 추가
    # for _, row in selected_stores.iterrows():
    #     folium.Marker(
    #         location=[row["latitude"], row["longitude"]],
    #         popup=f"{row['store_name']} ({row['avg_score']:.1f}점, 리뷰 {row['review_count']}개)",
    #         icon=folium.Icon(color="blue", icon="info-sign"),
    #     ).add_to(gangnam_map)

    # # 지도 저장 및 자동 실행
    # map_file = "gangnam_stores_map.html"
    # gangnam_map.save(map_file)
    # webbrowser.open(map_file)
    # print(f"강남 음식점 지도 저장 완료: {map_file}")

    """
    강남구 지역을 중심으로 음식점의 밀도와 평균 평점을 시각화
    - 클러스터링 기반 마커 표시
    - 음식점 개수를 구 단위로 집계하여 색상으로 표현
    """
    # 데이터 로드
    stores = dataframes["stores"]
    reviews = dataframes["reviews"]

    # 강남구 음식점 필터링
    gangnam_stores = stores[stores["area"].str.contains("강남", na=False)]

    # 음식점별 평균 평점 및 리뷰 개수 계산
    review_stats = reviews.groupby("store").agg(
        avg_score=("total_score", "mean"), review_count=("id", "count")
    ).reset_index()

    # 강남 음식점과 리뷰 통계를 병합
    gangnam_stores = gangnam_stores.merge(review_stats, left_on="id", right_on="store", how="left")

    # Folium 지도 생성 (강남역 중심 좌표)
    gangnam_map = folium.Map(location=[37.4979, 127.0276], zoom_start=13)

    # 음식점 밀도 클러스터링
    marker_cluster = MarkerCluster().add_to(gangnam_map)

    for _, row in gangnam_stores.iterrows():
        folium.Marker(
            location=[row["latitude"], row["longitude"]],
            popup=f"{row['store_name']} ({row['avg_score']:.1f}점, 리뷰 {row['review_count']}개)",
            icon=folium.Icon(color="blue", icon="info-sign"),
        ).add_to(marker_cluster)

    # 음식점 개수를 구 단위로 집계하여 색상으로 표현
    district_counts = gangnam_stores.groupby("area").size().reset_index(name="store_count")
    min_count, max_count = district_counts["store_count"].min(), district_counts["store_count"].max()

    for _, row in district_counts.iterrows():
        folium.CircleMarker(
            location=[37.4979, 127.0276],  # 강남구 중심 좌표
            radius=row["store_count"] / max_count * 20,  # 최대 크기를 20으로 정규화
            color="red",
            fill=True,
            fill_color="red",
            fill_opacity=0.6,
            popup=f"{row['area']}: {row['store_count']}개 음식점",
        ).add_to(gangnam_map)

    # 지도 저장 및 자동 실행
    map_file = "gangnam_stores_map2.html"
    gangnam_map.save(map_file)
    webbrowser.open(map_file)
    print(f"강남 음식점 지도 저장 완료: {map_file}")



def main():
    set_config()
    data = load_dataframes()
    show_store_categories_graph(data) # 음식점 카테고리 분포
    show_store_review_distribution_graph() # 음식점별 리뷰 개수 분포
    show_store_average_ratings_graph() # 음식점별 평균 평점 분포
    show_user_review_distribution_graph(data) # 유저별 리뷰 개수 분포
    show_user_age_gender_distribution_graph(data) # 유저 성별/나이대 분포
    show_stores_distribution_graph(data) # 각 음식점의 위치 분포를 지도에 나타내기 - 강남구 지역을 중심으로 음식점의 밀도와 평균 평점을 시각화


if __name__ == "__main__":
    main()
