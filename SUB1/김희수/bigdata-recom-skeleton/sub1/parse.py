import json
import pandas as pd
import os
import shutil
from scipy.sparse import csr_matrix

DATA_DIR = "../data"
DATA_FILE = os.path.join(DATA_DIR, "data.json")
DUMP_FILE = os.path.join(DATA_DIR, "dump.pkl")

store_columns = (
    "id",  # 음식점 고유번호
    "store_name",  # 음식점 이름
    "branch",  # 음식점 지점 여부
    "area",  # 음식점 위치
    "tel",  # 음식점 번호
    "address",  # 음식점 주소
    "latitude",  # 음식점 위도
    "longitude",  # 음식점 경도
    "category",  # 음식점 카테고리
)

review_columns = (
    "id",  # 리뷰 고유번호
    "store",  # 음식점 고유번호
    "user",  # 유저 고유번호
    "score",  # 평점
    "content",  # 리뷰 내용
    "reg_time",  # 리뷰 등록 시간
)


def import_data(data_path=DATA_FILE):
    """
    Req. 1-1-1 음식점 데이터 파일을 읽어서 Pandas DataFrame 형태로 저장합니다
    """

    try:
        with open(data_path, encoding="utf-8") as f:
            data = json.loads(f.read())
    except FileNotFoundError as e:
        print(f"`{data_path}` 가 존재하지 않습니다.")
        exit(1)

    stores = []  # 음식점 테이블
    reviews = []  # 리뷰 테이블
    menus = []  # 메뉴 테이블
    users = []  # 유저 테이블

    for d in data:
        # 음식점 정보
        categories = [c["category"] for c in d["category_list"]]
        stores.append(
            [
                d["id"],
                d["name"],
                d["branch"],
                d["area"],
                d["tel"],
                d["address"],
                d["latitude"],
                d["longitude"],
                "|".join(categories),
            ]
        )

        # 리뷰 및 유저 정보
        for review in d["review_list"]:
            r = review["review_info"]
            u = review["writer_info"]

            reviews.append(
                [r["id"], d["id"], u["id"], r["score"], r["content"], r["reg_time"]]
            )

            users.append(
                [u["id"], u["gender"], u["born_year"]]
            )

        # 메뉴 정보
        for i, menu in enumerate(d["menu_list"]):
            menu_id = menu.get("id", f"{d['id']}_menu_{i}")  # ID가 없으면 자동 생성
            menu_name = menu.get("menu", "Unknown")  # "menu" 키 사용
            menu_price = menu.get("price", 0)  # 가격이 없으면 0으로 설정
            menus.append([menu_id, d["id"], menu_name, menu_price])

    store_frame = pd.DataFrame(data=stores, columns=store_columns)
    review_frame = pd.DataFrame(data=reviews, columns=review_columns)
    menu_frame = pd.DataFrame(data=menus, columns=["id", "store", "menu_name", "price"])
    user_frame = pd.DataFrame(data=users, columns=["id", "gender", "age"])

    return {
        "stores": store_frame,
        "reviews": review_frame,
        "menus": menu_frame,
        "users": user_frame,
        }


def dump_dataframes(dataframes):
    pd.to_pickle(dataframes, DUMP_FILE)


def load_dataframes():
    return pd.read_pickle(DUMP_FILE)


def generate_user_item_matrices(dataframes):
    """
    Req. 1-4-1: 유저-아이템 평점 행렬을 생성하고 저장합니다 (Sparse Format)
    Req. 1-4-2: 유저-음식점 카테고리 평점 평균 행렬을 생성하고 저장합니다 (Sparse Format)
    """
    reviews = dataframes["reviews"]
    stores = dataframes["stores"]

    # 유저-음식점 평점 행렬 (User-Item Matrix)
    user_item_matrix = reviews.pivot(index="user", columns="store", values="score").fillna(0)  # NaN을 0으로 변환
    user_item_sparse = user_item_matrix.astype(pd.SparseDtype("float", fill_value=0))  # 메모리 최적화
    
    # 저장
    dataframes["user_item_matrix"] = user_item_sparse

    # --------------------------------------

    # 유저-카테고리 평점 평균 행렬 (User-Category Matrix)
    # 음식점과 카테고리를 매칭
    reviews_with_category = reviews.merge(stores[["id", "category"]], left_on="store", right_on="id")

    # 카테고리를 분할하여 여러 컬럼으로 저장 ("카페|디저트" → ["카페", "디저트"])
    expanded = reviews_with_category.assign(category=reviews_with_category["category"].str.split("|")).explode("category")

    # 유저-카테고리 평점 평균 계산
    user_category_matrix = expanded.groupby(["user", "category"])["score"].mean().unstack().fillna(0)  # NaN을 0으로 변환
    user_category_sparse = user_category_matrix.astype(pd.SparseDtype("float", fill_value=0))  # 메모리 최적화

    # 저장
    dataframes["user_category_matrix"] = user_category_sparse

    print("[+] 유저-아이템 행렬 및 유저-카테고리 행렬 생성 완료")

    return dataframes


def main():

    print("[*] Parsing data...")
    data = import_data()
    print("[+] Done")

    print("[*] Generating user-item matrices...")
    data = generate_user_item_matrices(data)  # 유저-아이템 행렬 생성
    print("[+] Done")

    print("[*] Dumping data...")
    dump_dataframes(data)
    print("[+] Done\n")

    data = load_dataframes()

    term_w = shutil.get_terminal_size()[0] - 1
    separater = "-" * term_w

    print("[음식점]")
    print(f"{separater}\n")
    print(data["stores"].head())
    print(f"\n{separater}\n\n")

    print("[리뷰]")
    print(f"{separater}\n")
    print(data["reviews"].head())
    print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
