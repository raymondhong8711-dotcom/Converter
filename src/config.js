export const CATEGORIES = {
    CURRENCY: '幣值',
    WEIGHT: '重量',
    LENGTH: '長度'
};

export const UNITS = {
    [CATEGORIES.CURRENCY]: [
        { id: 'TWD', name: '台幣 (TWD)', rate: 1 },
        { id: 'USD', name: '美金 (USD)', rate: 0.033 },
        { id: 'JPY', name: '日幣 (JPY)', rate: 4.8 },
        { id: 'CNY', name: '人民幣 (CNY)', rate: 0.23 },
        { id: 'EUR', name: '歐元 (EUR)', rate: 0.031 }, // Added EUR as an example of expansion
        { id: 'KRW', name: '韓元 (KRW)', rate: 45 },
        { id: 'HKD', name: '港幣 (HKD)', rate: 0.26 }
    ],
    [CATEGORIES.WEIGHT]: [
        { id: 'KG', name: '公斤 (KG)', factor: 1 },
        { id: 'LB', name: '磅 (LB)', factor: 2.20462 }
    ],
    [CATEGORIES.LENGTH]: [
        { id: 'M', name: '公尺 (M)', factor: 1 },
        { id: 'CM', name: '公分 (CM)', factor: 100 },
        { id: 'FT', name: '英尺 (FT)', factor: 3.28084 },
        { id: 'IN', name: '英寸 (IN)', factor: 39.3701 }
    ]
};

export const CURRENCY_API_URL = 'https://open.er-api.com/v6/latest/TWD';
