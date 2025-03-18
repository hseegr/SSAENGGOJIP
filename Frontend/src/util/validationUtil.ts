export const email = (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
};

export const required = (value: any) => !!value || 'Required.';

export const maxLen = (max: number) => (value: string) => value.length <= max || `Max ${max} characters`;

export const minLen = (min: number) => (value: string) => value.length >= min || `Min ${min} characters`;
