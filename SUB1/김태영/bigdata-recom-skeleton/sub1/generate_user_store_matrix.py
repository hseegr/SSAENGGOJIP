import os
import pandas as pd
from parse import load_dataframes

# 저장할 폴더 경로 설정
DATA_DIR = "../data"
PKL_FILE = os.path.join(DATA_DIR, "sparse_rating_matrix.pkl")

def generate_user_store_matrix(dataframes):
    """
    유저 - 음식점 평점 행렬을 생성하여 SparseDataFrame으로 변환 후 저장 (data 폴더 안에 저장)
    """
    # 리뷰 데이터 로드
    reviews = dataframes["reviews"]

    # 평점 데이터를 행렬 형태로 변환 (pivot)
    rating_matrix = reviews.pivot(index="user", columns="store", values="total_score")

    # Pandas Sparse Matrix 변환 (메모리 절약)
    # NaN을 0으로 변환 후 Sparse Matrix 변환
    sparse_matrix = rating_matrix.fillna(0).astype(pd.SparseDtype("float", fill_value=0))

    # data 폴더가 없으면 생성
    os.makedirs(DATA_DIR, exist_ok=True)

    # Sparse 행렬 저장
    sparse_matrix.to_pickle(PKL_FILE)
    print(f"유저-음식점 평점 희소 행렬 저장 완료: {PKL_FILE}")

    return sparse_matrix  # 생성된 행렬 반환

def load_and_display_matrix():
    """
    저장된 유저-음식점 희소 행렬을 불러와서 확인
    """
    if os.path.exists(PKL_FILE):
        sparse_matrix = pd.read_pickle(PKL_FILE)
        print("유저-음식점 평점 희소 행렬 로드 완료")
        print(f"행렬 크기: {sparse_matrix.shape}")  # (유저 수, 음식점 수)
        print(sparse_matrix.head())  # 상위 5개 행 출력
    else:
        print(f"파일이 존재하지 않습니다: {PKL_FILE}")

def main():
    data = load_dataframes()
    sparse_matrix = generate_user_store_matrix(data)
    load_and_display_matrix()  # 저장 후 바로 확인

if __name__ == "__main__":
    main()
