import itertools
from collections import Counter
from parse import load_dataframes
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm


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
    store_ratings = dataframes["reviews"].groupby("store")["score"].mean()
    
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
    raise NotImplementedError


def main():
    set_config()
    data = load_dataframes()
    # show_store_categories_graph(data)
    # show_store_review_distribution_graph()
    # show_store_average_ratings_graph()
    # show_user_review_distribution_graph(data)
    show_user_age_gender_distribution_graph(data)


if __name__ == "__main__":
    main()
