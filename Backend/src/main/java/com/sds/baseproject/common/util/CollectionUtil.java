package com.sds.baseproject.common.util;

import org.springframework.util.StringUtils;

import java.util.*;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

public class CollectionUtil {

    private CollectionUtil() {
    }

    /**
     * Collection 변환 작업 코드량을 줄이기위한 메소드
     *
     * @param fromList 변환 할 Collection
     * @param function 변환 메소드
     * @param <F>      원본 객체 형태
     * @param <T>      반환 할 객체 형태
     * @return 변환이 완료된 리스트
     */
    public static <F, T> List<T> transform(
            Collection<F> fromList, Function<? super F, ? extends T> function) {
        ArrayList<T> list = new ArrayList<>();
        if (fromList != null) {
            fromList.forEach(src -> list.add(function.apply(src)));
        }
        return list;
    }

    /**
     * Iterable 변환 작업 코드량을 줄이기위한 메소드
     *
     * @param fromList 변환 할 Iterable
     * @param function 변환 메소드
     * @param <F>      원본 객체 형태
     * @param <T>      반환 할 객체 형태
     * @return 변환이 완료된 리스트
     */
    public static <F, T> List<T> transform(
            Iterable<F> fromList, Function<? super F, ? extends T> function) {
        ArrayList<T> list = new ArrayList<>();
        if (fromList != null) {
            fromList.forEach(src -> list.add(function.apply(src)));
        }
        return list;
    }


    /**
     * Collection 변환 작업 코드량을 줄이기위한 메소드, 중복 제거 기능 포함(string 기준).
     *
     * @param fromList       변환 할 Collection
     * @param targetFunction 변환 메소드
     * @param <F>            원본 객체 형태
     * @param <T>            반환 할 객체 형태
     * @return 변환이 완료된 리스트
     */
    public static <F, T> List<T> transformDistinct(
            Collection<F> fromList, Function<? super F, ? extends T> targetFunction) {
        List<T> list = new ArrayList<>();
        if (fromList != null) {
            list =
                    fromList.stream()
                            .map(targetFunction)
                            .filter(x -> !StringUtils.isEmpty(x))
                            .distinct()
                            .collect(Collectors.toList());
        }
        return list;
    }

    /**
     * 두 개의 Collection을 비교하여 src에서 match에 없는 항목을 지움.
     * 원본 리스트와 수정요청 리스트를 비교하여 삭제된 항목을 원본에서 찾아 지우는 역할.
     *
     * @param srcList          변경할 Collection
     * @param matchList        비교 대상 collection
     * @param srcKeyFunction   src의 비교 대상 추출 메소드
     * @param matchKeyFunction match의 비교 대상 추출 메소드
     * @param <F>              src의 형태
     * @param <T>              match의 형태
     * @param <S>              비교 대상의 형태
     */
    public static <F, T, S> void removeNoneMatch(
            Collection<F> srcList,
            Collection<T> matchList,
            Function<? super F, ? extends S> srcKeyFunction,
            Function<? super T, ? extends S> matchKeyFunction) {
        Set<S> keySet = new HashSet<>();
        for (T t : matchList) {
            S key = matchKeyFunction.apply(t);
            if (key != null) {
                keySet.add(key);
            }
        }
        srcList.removeIf(f -> !keySet.contains(srcKeyFunction.apply(f)));
    }

    /**
     * 두 개의 Collection을 비교하여 src에서 match에 없는 항목을 List로 반환함.
     * Collection에서 직접 지우는 것이 아닌 soft delete 용도로 활용됨.
     *
     * @param srcList          원본 collection
     * @param matchList        비교 대상 collection
     * @param srcKeyFunction   src의 비교 대상 추출 메소드
     * @param matchKeyFunction match의 비교 대상 추출 메소드
     * @param <F>              src의 형태
     * @param <T>              match의 형태
     * @param <S>              비교 대상 형태
     * @return 추출된 결과
     */
    public static <F, T, S> List<F> findNoneMatch(
            Collection<F> srcList,
            Collection<T> matchList,
            Function<? super F, ? extends S> srcKeyFunction,
            Function<? super T, ? extends S> matchKeyFunction) {
        Set<S> keySet = new HashSet<>();
        for (T t : matchList) {
            S key = matchKeyFunction.apply(t);
            if (key != null) {
                keySet.add(key);
            }
        }
        return srcList.stream()
                .filter(f -> !keySet.contains(srcKeyFunction.apply(f)))
                .collect(Collectors.toList());
    }

    /**
     * 두 개의 collection을 비교하여 삭제, 수정, 삽입 작업을 수행함.
     * 특정 Entity하위에 있는 list의 정보를 수정할 때 주로 이용됨.
     *
     * @param targetList        변경 할 target Collection
     * @param srcList           변경 할 내용이 담긴 Collection
     * @param targetKeyFunction target의 비교 대상 추출 메소드
     * @param srcKeyFunction    src의 비교 대상 추출 메소드
     * @param deleteFunction    삭제 수행 메소드 (soft delete 수행 혹은 별도 연계 필요 시)
     * @param updateFunction    갱신 수행 메소드
     * @param insertFunction    새로운 객체 생성 메소드. 생성된 entity를 반환해야함.
     * @param <F>               원본의 형태
     * @param <T>               변경 할 내용 형태
     * @param <S>               비교 대상 형태
     */
    public static <F, T, S> void deleteOrUpdateOrInsert(
            Collection<F> targetList, // 원본
            Collection<T> srcList, // 업데이트 내용
            Function<F, S> targetKeyFunction, // 원본 Key
            Function<T, S> srcKeyFunction, // 업데이트 내용 Key
            Consumer<Collection<F>> deleteFunction,
            BiConsumer<F, T> updateFunction,
            Function<T, F> insertFunction) {

        // Update Or Save하고자 하는 Collection을 Map으로 mapping
        Map<S, T> srcMap = new HashMap();
        for (T t : srcList) {
            S key = srcKeyFunction.apply(t);
            if (key != null) {
                srcMap.put(key, t);
            }
        }

        if (deleteFunction != null) {
            // 원본에서 업데이트 할 대상이 없는 건은 삭제
            Collection<F> deleteList =
                    targetList.stream()
                            .filter(f -> !srcMap.containsKey(targetKeyFunction.apply(f)))
                            .collect(Collectors.toList());

            deleteFunction.accept(deleteList);
        }

        // 불필요한 Target 삭제
        targetList.removeIf(f -> !srcMap.containsKey(targetKeyFunction.apply(f)));

        // 원본 Collection을 Map으로 mapping
        Map<S, F> targetMap = new HashMap();
        for (F f : targetList) {
            S key = targetKeyFunction.apply(f);
            if (key != null) {
                targetMap.put(key, f);
            }
        }

        for (T t : srcList) {
            F f = targetMap.get(srcKeyFunction.apply(t));
            if (f != null) {
                if (updateFunction != null) {
                    updateFunction.accept(f, t);
                }
            } else {
                if (insertFunction != null) {
                    F result = insertFunction.apply(t);
                    targetList.add(result);
                    targetMap.put(targetKeyFunction.apply(result), result);
                }
            }
        }
    }

    /**
     * 단일 객체에 대해서 List 형태가 필요할 때 수행.
     *
     * @param t   단일 객체
     * @param <T> 단일 객체 형태
     * @return 단일 객체를 포함하는 리스트
     */
    public static <T> ArrayList<T> generateArrayListOf(T t) {
        ArrayList<T> list = new ArrayList<>();
        list.add(t);
        return list;
    }
}
