import os
import pandas as pd
from parse import load_dataframes

# 저장할 폴더 경로 설정
DATA_DIR = "../data"
PKL_FILE = os.path.join(DATA_DIR, "sparse_user_category_matrix.pkl")

def generate_user_category_matrix(dataframes):
    """
    유저 - 음식점 카테고리 평점 행렬을 생성하여 SparseDataFrame으로 변환 후 저장 (data 폴더 안에 저장)
    """
    # 음식점 및 리뷰 데이터 로드
    stores = dataframes["stores"]
    reviews = dataframes["reviews"]

    # 음식점 ID와 카테고리 매핑
    store_categories = stores[["id", "category"]].copy()

    # 여러 개의 카테고리를 가지는 경우 첫 번째 카테고리만 선택
    store_categories["category"] = store_categories["category"].apply(lambda x: x.split("|")[0] if "|" in x else x)

    # 리뷰 데이터와 음식점 카테고리 결합
    reviews_with_category = reviews.merge(store_categories, left_on="store", right_on="id", how="left")

    # 유저-카테고리 별 평균 평점 계산
    category_rating_matrix = reviews_with_category.groupby(["user", "category"])["total_score"].mean().reset_index()

    # 평점 데이터를 행렬 형태로 변환 (pivot)
    rating_matrix = category_rating_matrix.pivot(index="user", columns="category", values="total_score")

    # Pandas Sparse Matrix 변환 (메모리 절약)
    sparse_matrix = rating_matrix.fillna(0).astype(pd.SparseDtype("float", fill_value=0))

    # data 폴더가 없으면 생성
    os.makedirs(DATA_DIR, exist_ok=True)

    # Sparse 행렬 저장
    sparse_matrix.to_pickle(PKL_FILE)
    print(f"유저-음식점 카테고리 평점 희소 행렬 저장 완료: {PKL_FILE}")

    return sparse_matrix  # 생성된 행렬 반환

def load_and_display_matrix():
    """
    저장된 유저-음식점 카테고리 희소 행렬을 불러와서 확인
    """
    if os.path.exists(PKL_FILE):
        sparse_matrix = pd.read_pickle(PKL_FILE)
        print("유저-음식점 카테고리 평점 희소 행렬 로드 완료")
        print(f"행렬 크기: {sparse_matrix.shape}")  # (유저 수, 카테고리 수)
        print(sparse_matrix.head())  # 상위 5개 행 출력
    else:
        print(f"파일이 존재하지 않습니다: {PKL_FILE}")

def main():
    data = load_dataframes()
    sparse_matrix = generate_user_category_matrix(data)
    load_and_display_matrix()  # 저장 후 바로 확인

if __name__ == "__main__":
    main()