import _ from 'lodash';
declare function myTypeof(data: any): string;
declare const myDebounce: (func: (...arg: any) => any, waitConfig?: number | string | null) => _.DebouncedFuncLeading<(...arg: any) => any>;
export { myTypeof, myDebounce };
