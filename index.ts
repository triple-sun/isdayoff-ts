import { IsDayOffApi as IsDayOffApiClass } from './src/isdayoff';

export * from './src/isdayoff';
export * from './src/types';
export * from './src/enum'

const ISDAYOFF_DEFAULT_URL = "https://isdayoff.ru";
const IsDayOff = new IsDayOffApiClass(ISDAYOFF_DEFAULT_URL);

export default IsDayOff;
