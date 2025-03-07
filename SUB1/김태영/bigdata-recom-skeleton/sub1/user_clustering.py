import os
import pandas as pd
import numpy as np
import matplotlib.font_manager as fm
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.utils import parallel_backend
import matplotlib.pyplot as plt
import seaborn as sns

# 환경 변수 설정 (멀티코어 오류 방지)
os.environ["LOKY_MAX_CPU_COUNT"] = "4"

# 데이터 파일 경로 설정
DATA_DIR = "../data"
PKL_FILE = os.path.join(DATA_DIR, "sparse_user_category_matrix.pkl")

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

def load_sparse_matrix():
    """ 저장된 유저-음식점 카테고리 희소 행렬을 불러옴 """
    if os.path.exists(PKL_FILE):
        sparse_matrix = pd.read_pickle(PKL_FILE)
        print("유저-음식점 카테고리 평점 희소 행렬 로드 완료")
        print(f"행렬 크기: {sparse_matrix.shape}")  # (유저 수, 카테고리 수)
        return sparse_matrix
    else:
        print(f"파일이 존재하지 않습니다: {PKL_FILE}")
        return None

def preprocess_matrix(sparse_matrix):
    """ 희소 행렬을 밀집 행렬(Dense)로 변환하고 정규화 """
    dense_matrix = sparse_matrix.sparse.to_dense()
    scaler = StandardScaler()
    scaled_matrix = scaler.fit_transform(dense_matrix)
    return scaled_matrix

def apply_pca(scaled_matrix, n_components=50):
    """ 차원 축소(PCA)를 수행하여 군집화를 용이하게 함 """
    pca = PCA(n_components=n_components)
    reduced_matrix = pca.fit_transform(scaled_matrix)
    
    explained_variance = np.sum(pca.explained_variance_ratio_) * 100
    print(f"PCA 적용 완료! {n_components}개 차원으로 축소됨 (설명된 분산: {explained_variance:.2f}%)")
    return reduced_matrix

def perform_kmeans_clustering(reduced_matrix, n_clusters=10):
    """ K-Means 군집화 수행 (멀티코어 오류 방지) """
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)

    with parallel_backend("threading", n_jobs=1):  # 멀티코어 사용 제한
        cluster_labels = kmeans.fit_predict(reduced_matrix)

    print("K-Means 군집화 완료")
    return cluster_labels, kmeans

def visualize_clusters(reduced_matrix, cluster_labels):
    """ 군집화 결과를 2D 시각화 (PCA 주성분 기준) """
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=reduced_matrix[:, 0], y=reduced_matrix[:, 1], hue=cluster_labels, palette="tab10", alpha=0.7)
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.title("유저 군집화 결과 (K-Means)")
    plt.legend(title="Cluster")
    plt.show()

def analyze_clusters(sparse_matrix, cluster_labels):
    """ 군집별 유저 수 및 대표적인 음식점 카테고리 분석 """
    sparse_matrix["Cluster"] = cluster_labels
    cluster_counts = sparse_matrix["Cluster"].value_counts().sort_index()
    print("\n군집별 유저 수:")
    print(cluster_counts)

    print("\n군집별 대표 음식점 카테고리 (평균 평점 상위 3개):")
    for cluster in range(len(cluster_counts)):
        cluster_data = sparse_matrix[sparse_matrix["Cluster"] == cluster].drop(columns=["Cluster"])
        
        category_means = cluster_data.mean()
        category_means = category_means[category_means > 0].sort_values(ascending=False).head(3)
        
        print(f"\n[Cluster {cluster}]")
        print(category_means)

def main():
    set_config()
    sparse_matrix = load_sparse_matrix()
    if sparse_matrix is not None:
        scaled_matrix = preprocess_matrix(sparse_matrix)
        reduced_matrix = apply_pca(scaled_matrix, n_components=50)
        cluster_labels, kmeans = perform_kmeans_clustering(reduced_matrix, n_clusters=10)

        # 군집화된 결과를 시각화
        visualize_clusters(reduced_matrix, cluster_labels)

        # 군집 분석 (유저 수 및 대표 카테고리)
        analyze_clusters(sparse_matrix, cluster_labels)

if __name__ == "__main__":
    main()