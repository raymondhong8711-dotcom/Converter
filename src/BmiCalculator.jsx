import React, { useState } from 'react';

function BmiCalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const calculateBmi = () => {
        if (!height || !weight) return null;
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        if (h <= 0 || w <= 0) return null;
        const bmi = w / (h * h);
        return bmi.toFixed(2);
    };

    const getBmiCategory = (bmi) => {
        if (!bmi) return '';
        if (bmi < 18.5) return '體重過輕';
        if (bmi >= 18.5 && bmi < 24) return '正常範圍';
        if (bmi >= 24 && bmi < 27) return '過重';
        if (bmi >= 27 && bmi < 30) return '輕度肥胖';
        if (bmi >= 30 && bmi < 35) return '中度肥胖';
        return '重度肥胖';
    };

    const bmi = calculateBmi();
    const category = getBmiCategory(bmi);

    return (
        <div className="glass-card animate-fade-in">
            <div className="input-group">
                <label>身高 (公分)</label>
                <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="例如: 175"
                />
            </div>

            <div className="input-group" style={{ marginTop: '1rem' }}>
                <label>體重 (公斤)</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="例如: 70"
                />
            </div>

            {bmi && (
                <div className="result-display" style={{ marginTop: '2rem' }}>
                    <div className="result-value">{bmi}</div>
                    <div className="result-unit">BMI</div>
                    <div style={{ marginTop: '0.8rem', fontSize: '1.2rem', color: 'var(--text-color, #333)' }}>
                        狀態: <strong>{category}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BmiCalculator;