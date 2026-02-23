import React, { useState, useEffect } from 'react';
import { CATEGORIES, UNITS, CURRENCY_API_URL } from './config';

function App() {
    const [category, setCategory] = useState(CATEGORIES.CURRENCY);
    const [value, setValue] = useState(1);
    const [fromUnit, setFromUnit] = useState(UNITS[CATEGORIES.CURRENCY][0].id);
    const [toUnit, setToUnit] = useState(UNITS[CATEGORIES.CURRENCY][1].id);
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const res = await fetch(CURRENCY_API_URL);
            const data = await res.json();
            if (data.result === 'success') {
                setRates(data.rates);
                setLastUpdated(new Date().toLocaleTimeString());
            } else {
                throw new Error('API returned failure');
            }
        } catch (err) {
            console.error("Failed to fetch rates, using fallback:", err);
            // Fallback to config.js defaults
            const fallbackRates = {};
            UNITS[CATEGORIES.CURRENCY].forEach(u => {
                fallbackRates[u.id] = u.rate;
            });
            setRates(fallbackRates);
            setLastUpdated("使用預設匯率 (離線)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (category === CATEGORIES.CURRENCY && Object.keys(rates).length === 0) {
            fetchRates();
        }
    }, [category]);

    // Handle category change
    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        setFromUnit(UNITS[newCat][0].id);
        setToUnit(UNITS[newCat][1].id);
    };

    // Handle unit swap
    const handleSwap = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
    };

    const convertValue = () => {
        const numValue = parseFloat(value) || 0;
        if (category === CATEGORIES.CURRENCY) {
            // Logic: value / rateFrom * rateTo
            const rateFrom = rates[fromUnit] || 1;
            const rateTo = rates[toUnit] || 1;
            return (numValue / rateFrom) * rateTo;
        } else {
            const units = UNITS[category];
            const fromFactor = units.find(u => u.id === fromUnit).factor;
            const toFactor = units.find(u => u.id === toUnit).factor;
            return (numValue / fromFactor) * toFactor;
        }
    };

    const result = convertValue();

    // Special logic for length display (Imperial combinations)
    const getImperialDisplay = () => {
        if (category !== CATEGORIES.LENGTH) return null;

        // Convert current value (from fromUnit) to Meters first
        const fromFactor = UNITS[CATEGORIES.LENGTH].find(u => u.id === fromUnit).factor;
        const valueInMeters = value / fromFactor;

        // Convert Meters to total Inches
        const totalInches = valueInMeters * 39.3701;
        const feet = Math.floor(totalInches / 12);
        const remainingInches = (totalInches % 12).toFixed(1);

        return {
            totalFeet: (totalInches / 12).toFixed(3),
            totalInches: totalInches.toFixed(2),
            combined: `${feet}'${remainingInches}"`
        };
    };

    const imperialInfo = getImperialDisplay();

    return (
        <div className="app-container">
            <div className="header">
                <h1>Unit Converter</h1>
            </div>

            <div className="tabs">
                {Object.values(CATEGORIES).map(cat => (
                    <div
                        key={cat}
                        className={`tab ${category === cat ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat)}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            <div className="glass-card animate-fade-in">
                <div className="input-group">
                    <label>輸入數值</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="請輸入數值"
                    />
                </div>

                <div className="selector-container">
                    <div className="input-group" style={{ flex: 1 }}>
                        <label>從</label>
                        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                            {UNITS[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <button className="swap-btn" onClick={handleSwap} aria-label="Swap units">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                    </button>

                    <div className="input-group" style={{ flex: 1 }}>
                        <label>到</label>
                        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                            {UNITS[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="result-display">
                    <div className="result-value">
                        {loading ? '...' : result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </div>
                    <div className="result-unit">{toUnit}</div>
                </div>

                {category === CATEGORIES.LENGTH && (
                    <div className="imperial-secondary animate-fade-in">
                        <div className="imperial-main">{imperialInfo.combined}</div>
                        <div className="imperial-details">
                            <span>{imperialInfo.totalFeet} FT</span>
                            <span>•</span>
                            <span>{imperialInfo.totalInches} IN</span>
                        </div>
                    </div>
                )}

                {category === CATEGORIES.CURRENCY && (
                    <div className="sync-container animate-fade-in">
                        <div className="sync-info">
                            {loading ? '匯率更新中...' : `最後更新: ${lastUpdated || '未更新'}`}
                        </div>
                        <button
                            className={`refresh-btn ${loading ? 'loading' : ''}`}
                            onClick={fetchRates}
                            disabled={loading}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                            </svg>
                            刷新匯率
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
