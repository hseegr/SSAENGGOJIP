from parse import load_dataframes
import pandas as pd
import shutil


def sort_stores_by_score(dataframes, n=20, min_reviews=30):
    """
    Req. 1-2-1 각 음식점의 평균 평점을 계산하여 높은 평점의 음식점 순으로 `n`개의 음식점을 정렬하여 리턴합니다
    Req. 1-2-2 리뷰 개수가 `min_reviews` 미만인 음식점은 제외합니다.
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    scores = scores_group["score"].mean().reset_index(name="avg_score")
    review_counts = scores_group["score"].count().reset_index(name="review_count")
    
    # 리뷰 개수가 min_reviews 이상인 음식점 필터링
    filtered_scores = pd.merge(scores, review_counts, on=["store", "store_name"])
    filtered_scores = filtered_scores[filtered_scores.review_count >= min_reviews]
    
    # 평균 평점이 높은 순으로 정렬 후 상위 n개 반환
    return filtered_scores.sort_values(by="avg_score", ascending=False).head(n)

def get_most_reviewed_stores(dataframes, n=20):
    """
    Req. 1-2-3 가장 많은 리뷰를 받은 `n`개의 음식점을 정렬하여 리턴합니다
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    review_counts = stores_reviews.groupby(["store", "store_name"]).size().reset_index(name="review_count")
    
    return review_counts.sort_values(by="review_count", ascending=False).head(n)


def get_most_active_users(dataframes, n=20):
    """
    Req. 1-2-4 가장 많은 리뷰를 작성한 `n`명의 유저를 정렬하여 리턴합니다.
    """
    user_review_counts = dataframes["reviews"].groupby("user").size().reset_index(name="review_count")
    
    return user_review_counts.sort_values(by="review_count", ascending=False).head(n)


def main():
    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    stores_most_scored = sort_stores_by_score(data)
    most_reviewed_stores = get_most_reviewed_stores(data)
    most_active_users = get_most_active_users(data)


    print("[최고 평점 음식점]")
    print(f"{separater}\n")
    for i, store in stores_most_scored.iterrows():
        print(
            "{rank}위: {store}({score}점, 리뷰 {count}개)".format(
                rank=i + 1, store=store.store_name, score=store.avg_score, count=store.review_count
            )
        )
    print(f"\n{separater}\n\n")

    print("[가장 많은 리뷰를 받은 음식점]")
    print(f"{separater}\n")
    for i, store in most_reviewed_stores.iterrows():
        print(
            "{rank}위: {store} (리뷰 {count}개)".format(
                rank=i + 1, store=store.store_name, count=store.review_count
            )
        )
    print(f"\n{separater}\n\n")

    print("[가장 활발한 유저]")
    print(f"{separater}\n")
    for i, user in most_active_users.iterrows():
        print(
            "{rank}위: 유저 {user_id} (리뷰 {count}개)".format(
                rank=i + 1, user_id=user.user, count=user.review_count
            )
        )
    print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
