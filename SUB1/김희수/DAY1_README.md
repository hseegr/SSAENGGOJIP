# 250304 DAY1 개인 과제 및 실습

## 명세서 과제 실습 - Rep 1. 데이터 전처리(parse.py)

- 데이터 다운로드 및 parse.py 파일의 함수 미완성 부분 구현 완료

```
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
        for menu in d["menu_list"]:
            menus.append(
                [menu["id"], d["id"], menu["menu_name"], menu["price"]]
            )

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
```

## 기획 - 아이디어 도출

### 부동산 서비스

1. 유사한 이용자들 기반의 협업 필터링 추천 서비스

- 어떤 추천 서비스 제공 :
  - 사용자의 관심 매물이나 즐겨찾기 한 지역 및 매물을 예측하여 추천
- 어떻게 추천 :
  - 사용자의 관심 매물 및 즐겨찾기 한 데이터를 축적하여 유사한 이용자들이 선호한 매물을 예측하여 추천하는 협업 필터링 활용
- 관련 데이터 수집 방법 :
  - 실제 사용자들의 데이터 수집

---

2. 지역 상권 기반 추천

- 어떤 추천 서비스 제공 :
  1. 관심 매물, 즐겨찾기 지역의 데이터 활용
  - 지역 상권 정보, 학군, 범죄율, 환경 등 부동산 결정에 영향을 주는 다양한 외부 데이터를 결합하여 맞춤 랭킹 산정하여 추천
- 어떻게 추천 :
  - 각 매물의 상권 정보 카테고리 별 가중치를 주고 해당 가중치의 합을 활용하여 추천
- 관련 데이터 수집 방법 :
  - https://sgis.kostat.go.kr/developer/html/newOpenApi/api/dataApi/urban.html - 동네 생활 인구 통계 API
  - https://safemap.go.kr/opna/data/dataView.do?objtId=199
  - https://cleanair.seoul.go.kr/citizen/api
  - https://data.seoul.go.kr/dataList/OA-394/S/1/datasetView.do
  - https://safemap.go.kr/opna/data/dataView.do?objtId=145
  - https://apis.map.kakao.com/ / https://tmapapi.tmapmobility.com/main.html → 다양한 편의시설 참고

### 내한공연 알림 서비스

- 주요 서비스
  - 내한 아티스트에 대한 공연 정보 열람 및 알림, 즐겨찾기 설정
  - 캘린더에 내가 즐겨찾기 한 아티스트의 공연 및 티켓팅 일정 표시
  - 사용자가 공연 알림을 받은 후 **즉시 예매할 수 있도록 예매처 공식 페이지로 연결.**
  - 예매 오픈 10분 전 리마인드 알림 기능 제공. (이메일)
- 추가 서비스
  - 공연 당일 셔틀 버스 및 숙소 데이터 제공
  - 공연장 근처 주차장(공영 및 민영)
  - 시야 정보
  - 내가 관람하는 공연의 당일 일정 (MD 판매 시작, 스탠딩 대기 시작, 입장 시작, 공연 시간, 지하철 막차 시간 등) 하루 일정표로 열람할 수 있는 서비스
  - 콘서트 근처 맛집 및 카페
- 사용할 데이터
  - 예매처의 API가 없거나 제휴가 어려운 경우, 예매 링크를 제공하는 방식으로 구현.
  - https://www.kopis.or.kr/por/cs/openapi/openApiInfo.do?menuId=MNU_00074
  - https://kakaot-biz-developers.oopy.io/ → 셔틀 API는 비즈니스 API라, 셔틀 버스 페이지로 링크 연결해 주는 방법도 생각해야 할 것 같음
  - https://api.visitkorea.or.kr/#/useInforStay / https://www.airbnb.co.kr/help/article/3418 → 숙박 API
  - https://kukim.tistory.com/138 → 숙박 관련 데이터 참고하면 좋은 블로그
  - https://apis.map.kakao.com/ / https://tmapapi.tmapmobility.com/main.html → 근처 카페 및 맛집 정보
  - https://t-data.seoul.go.kr/dataprovide/trafficdataviewfile.do?data_id=10328 / https://www.data.go.kr/data/15012896/standard.do → 주차장 api
