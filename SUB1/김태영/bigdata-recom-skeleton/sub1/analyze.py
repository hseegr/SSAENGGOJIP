from parse import load_dataframes
import pandas as pd
import shutil


def sort_stores_by_score(dataframes, n=20, min_reviews=30):
    """
    Req. 1-2-1 각 음식점의 평균 평점을 계산하여 높은 평점의 음식점 순으로 n개의 음식점을 정렬하여 리턴합니다
    Req. 1-2-2 리뷰 개수가 `min_reviews` 미만인 음식점은 제외합니다.
    """
    stores_reviews = pd.merge(
        dataframes["stores"], dataframes["reviews"], left_on="id", right_on="store"
    )
    scores_group = stores_reviews.groupby(["store", "store_name"])
    scores = scores_group["score"].mean().reset_index()
    review_counts = scores_group.size().reset_index(name="review_count")
    scores = pd.merge(scores, review_counts, on=["store", "store_name"])
    
    # 최소 리뷰 개수 필터링 적용
    scores = scores[scores["review_count"] >= min_reviews]
    
    # 평점 기준 정렬 후 상위 n개 음식점 반환
    scores = scores.sort_values(by=["score", "review_count"], ascending=[False, False])
    return scores.head(n)


def get_most_reviewed_stores(dataframes, n=20):
    """
    Req. 1-2-3 가장 많은 리뷰를 받은 n개의 음식점을 정렬하여 리턴합니다
    """
    review_counts = dataframes["reviews"].groupby("store").size().reset_index(name="review_count")
    review_counts = pd.merge(review_counts, dataframes["stores"], left_on="store", right_on="id")
    review_counts = review_counts.sort_values(by="review_count", ascending=False)
    return review_counts.head(n)


def get_most_active_users(dataframes, n=20):
    """
    Req. 1-2-4 가장 많은 리뷰를 작성한 n명의 유저를 정렬하여 리턴합니다.
    """
    user_reviews = dataframes["reviews"].groupby("user").size().reset_index(name="review_count")
    user_reviews = pd.merge(user_reviews, dataframes["users"], left_on="user", right_on="id")
    user_reviews = user_reviews.sort_values(by="review_count", ascending=False)
    return user_reviews.head(n)


def main():
    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    stores_most_scored = sort_stores_by_score(data)
    stores_most_reviewed = get_most_reviewed_stores(data)
    users_most_active = get_most_active_users(data)

    print("[최고 평점 음식점]")
    print(f"{separater}\n")
    for i, store in stores_most_scored.iterrows():
        print(
            "{rank}위: {store}({score}점)".format(
                rank=i + 1, store=store.store_name, score=store.score
            )
        )
    print(f"\n{separater}\n\n")

    print("[가장 많은 리뷰를 받은 음식점]")
    print(f"{separater}\n")
    print(stores_most_reviewed[["store_name", "review_count"]].to_string(index=False))
    print(f"\n{separater}\n\n")
    
    print("[가장 많은 리뷰를 작성한 유저]")
    print(f"{separater}\n")
    print(users_most_active[["id", "gender", "age", "review_count"]].to_string(index=False))
    print(f"\n{separater}\n\n")
    

if __name__ == "__main__":
    main()
