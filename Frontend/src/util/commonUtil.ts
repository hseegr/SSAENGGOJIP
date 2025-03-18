import _ from 'lodash'
import {LocationQueryValue} from "vue-router";

export const copyFields = <T extends Object, U extends Object>(target: U, source: T) => {
    const targetFields = Object.keys(target) as Array<keyof U>;
    const pickedSource = _.pick(source, targetFields);
    const result = {...target, ..._.cloneDeep(pickedSource)} as U;
    Object.assign(target, result);
}

export const getRouteParam = (param: string | string[]): string | undefined => {
    if (typeof param === 'string') {
        return param;
    }
};


export const getQueryValue = (
    value: LocationQueryValue | LocationQueryValue[],
): string | undefined => {
    if (typeof value === 'string') {
        return value;
    }
};

export const parseQueryValue = (
    value: LocationQueryValue | LocationQueryValue[],
) => {
    if (value && typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (error) {
            console.error(error);
            return {};
        }
    } else {
        return {};
    }
};
