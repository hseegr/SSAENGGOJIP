import {format, isToday, parseISO} from 'date-fns'


export const time = (value?: string) => {
    if (!value) {
        return '-';
    }
    const date = parseISO(value);

    if (!date) {
        return value;
    }

    if (isToday(date)) {
        return format(date, 'HH:mm:ss');
    } else {
        return format(date, "yyyy.MM.dd");
    }
};
