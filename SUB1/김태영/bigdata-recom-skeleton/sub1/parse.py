import json
import pandas as pd
import os
import shutil

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
    "total_score",  # 평점
    "content",  # 리뷰 내용
    "reg_time",  # 리뷰 등록 시간
)

menu_columns = (
    "id",  # 메뉴 고유번호
    "store",  # 음식점 고유번호
    "menu_name",  # 메뉴 이름
    "price",  # 가격
)

user_columns = (
    "id",  # 유저 고유번호
    "gender",  # 성별
    "age",  # 나이
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
    users = {} # 유저 테이블 (중복 방지)

    menu_id = 1  # 메뉴 ID 자동 증가 값
    
    for d in data:

        categories = [c["category"] for c in d.get("category_list", [])]
        stores.append(
            [
                int(d["id"]),
                str(d["name"]),
                str(d.get("branch", "")),
                str(d.get("area", "")),
                str(d.get("tel", "")),
                str(d.get("address", "")),
                float(d["latitude"]) if d["latitude"] is not None else 0.0,  # None 값 처리
                float(d["longitude"]) if d["longitude"] is not None else 0.0,  # None 값 처리
                "|".join(categories),
            ]
        )
        
        for menu in d.get("menu_list", []):
            menus.append(
                [
                    menu_id,
                    int(d["id"]),
                    str(menu.get("menu", "")),
                    int(menu.get("price", 0) or 0)
                ]
            )
            menu_id += 1

        for review in d.get("review_list", []):
            r = review["review_info"]
            u = review["writer_info"]

            reviews.append([
                int(r["id"]),
                int(d["id"]),
                int(u["id"]),
                int(r["score"]),  # int형 total_score
                str(r["content"]),
                str(r["reg_time"])
            ])
            
            users[u["id"]] = [
                int(u["id"]),
                str(u["gender"]),
                int(u["born_year"])
            ]

    # 데이터 프레임 생성 및 데이터 타입 변환
    store_frame = pd.DataFrame(data=stores, columns=store_columns).astype({
        "id": "int32", "latitude": "float64", "longitude": "float64"
    })

    review_frame = pd.DataFrame(data=reviews, columns=review_columns).astype({
        "id": "int32", "store": "int32", "user": "int32", "total_score": "int32"
    })

    menu_frame = pd.DataFrame(data=menus, columns=menu_columns).astype({
        "id": "int32", "store": "int32", "price": "int32"
    })

    user_frame = pd.DataFrame(data=list(users.values()), columns=user_columns).astype({
        "id": "int32", "gender": "string", "age": "int32"
    })

    return {"stores": store_frame, "reviews": review_frame, "menus": menu_frame, "users": user_frame}


def dump_dataframes(dataframes):
    pd.to_pickle(dataframes, DUMP_FILE)


def load_dataframes():
    return pd.read_pickle(DUMP_FILE)


def main():

    print("[*] Parsing data...")
    data = import_data()
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
    
    print("[메뉴]")
    print(f"{separater}\n")
    print(data["menus"].head())
    print(f"\n{separater}\n\n")
    
    print("[유저]")
    print(f"{separater}\n")
    print(data["users"].head())
    print(f"\n{separater}\n\n")


if __name__ == "__main__":
    main()
