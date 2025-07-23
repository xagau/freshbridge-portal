type DataPoint = {
    x: Date;
    y: number | number[] | any;
};

export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | string;

export const parseDate = (dateStr: string | Date): Date => {
    return typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
};

export const sampleDataReduction = (data: DataPoint[], option: TimeUnit, show: number): DataPoint[] => {
    let sampledData: DataPoint[] = [];
    let tempData: DataPoint[] = [];
    const dataLength: number = data.length;

    if (dataLength === 0) return sampledData;

    const timeUnits: Record<TimeUnit, number> = {
        millisecond: 1,
        second: 1000,
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        quarter: 90 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
    };

    const selectedMultiplier: number = timeUnits[option];
    const endDate: Date = parseDate(data[dataLength - 1].x);
    const firstData: Date = parseDate(data[0].x);
    const calculatedDate: Date = new Date(endDate.getTime() - show * selectedMultiplier);
    const startDate: Date = firstData.getTime() > calculatedDate.getTime() ? firstData : calculatedDate;

    tempData = data.filter((item) => parseDate(item.x) >= startDate);
    const tempLen: number = tempData.length;

    if (['minute', 'second', 'millisecond'].includes(option)) {
        if (tempLen < show) {
            const adjustedStartDate: Date = new Date(endDate);
            adjustedStartDate.setHours(endDate.getHours() - 4);
            tempData = data.filter((item) => parseDate(item.x) >= adjustedStartDate);
        }
        return tempData;
    } else if (['day', 'hour'].includes(option)) {
        return tempData;
    } else if (['week', 'month', 'quarter', 'year'].includes(option)) {
        // Define slice units for sampling
        const sliceUnits: Record<'week' | 'month' | 'quarter' | 'year', number> = {
            week: 7,
            month: 30,
            quarter: 90,
            year: 365 / 2
        };

        // Check if the `option` is present in `sliceUnits`
        if (option in sliceUnits) {
            const selectedSlicer: number = sliceUnits[option as keyof typeof sliceUnits];
            for (let i = 0; i < tempLen; i += selectedSlicer) {
                const range = tempData.slice(i, i + selectedSlicer);
                const rangeAverage =
                    range.reduce((sum, value) => {
                        return sum + (value.y as number); // Assume `y` is a number (not array)
                    }, 0) / range.length;

                sampledData.push({ x: range[0].x, y: rangeAverage });
            }
            return sampledData;
        }
    }

    return data; // Default fallback
};

export const sampleDataReductionByArray = (data: DataPoint[], option: TimeUnit, show: number): DataPoint[] => {
    let sampledData: DataPoint[] = [];
    const dataLength: number = data.length;

    if (dataLength === 0) return sampledData;

    const timeUnits: Record<TimeUnit, number> = {
        millisecond: 1,
        second: 1000,
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        quarter: 90 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
    };

    const selectedMultiplier: number = timeUnits[option];
    const endDate: Date = parseDate(data[dataLength - 1].x);
    const firstData: Date = parseDate(data[0].x);
    const calculatedDate: Date = new Date(endDate.getTime() - show * selectedMultiplier);
    const startDate: Date = firstData.getTime() > calculatedDate.getTime() ? firstData : calculatedDate;

    let tempData: DataPoint[] = data.filter((item) => parseDate(item.x) >= startDate);
    const tempLen: number = tempData.length;

    if (['minute', 'second', 'millisecond'].includes(option)) {
        if (tempLen < show) {
            const adjustedStartDate: Date = new Date(endDate);
            adjustedStartDate.setHours(endDate.getHours() - 4);
            tempData = data.filter((item) => parseDate(item.x) >= adjustedStartDate);
        }
        return tempData;
    } else if (['day', 'hour'].includes(option)) {
        return tempData;
    } else if (['week', 'month', 'quarter', 'year'].includes(option)) {
        const sliceUnits: Record<'week' | 'month' | 'quarter' | 'year', number> = {
            week: 7,
            month: 30,
            quarter: 90,
            year: 366 / 2
        };

        // Check if the `option` is present in `sliceUnits`
        if (option in sliceUnits) {
            const selectedSlicer: number = sliceUnits[option as keyof typeof sliceUnits];
            for (let i = 0; i < tempLen; i += selectedSlicer) {
                let sampledPointY: number | number[];

                // Handle case where the `y` value is an array
                if (Array.isArray(tempData[i].y)) {
                    sampledPointY = [...(tempData[i].y as number[])]; // Copy array to avoid mutation
                } else {
                    sampledPointY = tempData[i].y as number;
                }

                sampledData.push({ x: tempData[i].x, y: sampledPointY });
            }
        }
        return sampledData;
    }

    return data;
};

// Function 3: sampleDataByFixedLength
export const sampleDataByFixedLength = (data: any, option: any, show: any): any => {
    let sampledData: any = [];
    const dataLength = data.length;

    if (dataLength === 0) return sampledData;

    const timeUnits: any = {
        millisecond: 'millisecond',
        second: 'second',
        minute: 'minute',
        hour: 'hour',
        day: 'day',
        week: 'week',
        month: 'month',
        quarter: 'quarter',
        year: 'year'
    };

    if (!timeUnits[option]) return data;

    const parseDate = (dateStr: any) => new Date(dateStr);

    const average = (arr: any) => {
        if (arr.length === 0) return 0;
        if (typeof arr[0] === 'number') {
            return arr.reduce((acc: any, val: any) => acc + val, 0) / arr.length;
        } else {
            const length = arr[0].length;

            const avgArr: any = [];
            Array(length)
                .fill(null)
                .forEach((_, i) => {
                    const val = arr.map((data: any) => Number(data[i])).reduce((acc: any, val: any) => acc + val, 0) / arr.length;
                    avgArr.push(val);
                });
            return avgArr;
        }
    };

    let tempData = [];
    let currentUnit = null;

    for (let i = dataLength - 1; i >= 0; i--) {
        const dataPoint = data[i];
        const date = parseDate(dataPoint.x);

        let unit = null;
        if (option === 'day') {
            unit = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
        } else if (option === 'week') {
            unit = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
        } else if (option === 'month') {
            unit = date.getFullYear() * 12 + date.getMonth();
        } else if (option === 'year') {
            unit = date.getFullYear();
        } else if (option === 'hour') {
            unit = Math.floor(date.getTime() / (60 * 60 * 1000));
        } else if (option === 'minute') {
            unit = Math.floor(date.getTime() / (60 * 1000));
        } else if (option === 'second') {
            unit = Math.floor(date.getTime() / 1000);
        } else if (option === 'millisecond') {
            unit = Math.floor(date.getTime() / 1);
        } else if (option === 'quarter') {
            unit = date.getFullYear() * 4 + Math.floor(date.getMonth() / 3);
        }

        if (currentUnit === null) {
            currentUnit = unit;
        }

        if (unit !== currentUnit) {
            const avgValues = average(tempData.map((item) => item.y));
            sampledData.unshift({ x: tempData[0].x, y: avgValues });
            tempData = [];
            currentUnit = unit;
        }

        tempData.push(dataPoint);

        if (sampledData.length >= show) {
            break;
        }
    }

    if (tempData.length > 0) {
        const avgValues = average(tempData.map((item) => item.y));
        sampledData.unshift({ x: tempData[0].x, y: avgValues });
    }
    if (['week', 'month', 'quarter'].includes(option)) {
        const days: any = {
            week: 7,
            month: 30,
            quarter: 90
        };
        const dayCn = 24 * 60 * 60 * 1000;
        if (new Date(sampledData[sampledData.length - 1].x).getTime() / dayCn - new Date(sampledData[sampledData.length - 2].x).getTime() / dayCn < days[option]) {
            sampledData.pop();
        } else {
            sampledData.shift();
        }
    }
    return sampledData;
};

// Function 4: generateRandomData
export const generateRandomData = (startDate: string | Date, endDate: string | Date, intervalHours: number, minValue: number, maxValue: number): DataPoint[] => {
    const data: DataPoint[] = [];
    let currentDate: Date = parseDate(startDate);
    const end: Date = parseDate(endDate);

    while (currentDate <= end) {
        const currentValue: number = minValue + Math.random() * (maxValue - minValue);
        data.push({ x: new Date(currentDate), y: parseFloat(currentValue.toFixed(2)) });
        currentDate = new Date(currentDate.getTime() + intervalHours * 60 * 60 * 1000);
    }

    return data;
};

// Function 5: generateRandomMultiData
export const generateRandomMultiData = (startDate: string | Date, endDate: string | Date, intervalHours: number, minValue: number, maxValue: number, datasetsCount: number = 2, inter: boolean = false): DataPoint[] => {
    const data: DataPoint[] = [];
    let currentDate: Date = parseDate(startDate);
    const end: Date = parseDate(endDate);

    while (currentDate <= end) {
        let currentValues;
        if (inter) {
            let incr = maxValue;
            currentValues = Array(datasetsCount)
                .fill(null)
                .map((_, i) => {
                    return (minValue + Math.random() * (maxValue - minValue) + incr * (datasetsCount - i * 1.2)).toFixed(0);
                });
        } else {
            currentValues = Array(datasetsCount)
                .fill(null)
                .map(() => {
                    return (minValue + Math.random() * (maxValue - minValue)).toFixed(0);
                });
        }
        data.push({ x: new Date(currentDate), y: [...currentValues] });

        currentDate = new Date(currentDate.getTime() + intervalHours * 60 * 60 * 1000);
    }
    return data;
};

export const trackByFn = (): string => {
    const timestamp = Date.now();
    const randomNum = Math.random().toString(36).substring(2, 8);
    const uniqueId = `${timestamp}-${randomNum}`;

    return uniqueId;
};
