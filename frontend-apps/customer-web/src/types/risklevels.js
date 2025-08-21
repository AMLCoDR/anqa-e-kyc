
export const riskLevels = [
    { value: '0', key: 'UNDEFINED', label: 'Unset' },
    { value: '1', key: 'LOW', label: 'Low' },
    { value: '2', key: 'MODERATE', label: 'Moderate' },
    { value: '3', key: 'HIGH', label: 'High' },
    { value: '4', key: 'SEVERE', label: 'Severe' },
]

export const customerRisks = riskLevels.slice(0, 4);

export const findByID = (id) => {
    const parsed = Number.parseInt(id, 10);

    if (!Number.isNaN(parsed)) {
        return riskLevels[id];
    }

    if (!id || (id === '')) {
        id = 'UNDEFINED'
    }

    return riskLevels.find(r => r.key === id);
}

export const findByLabel = (label) => {
    return riskLevels.find(r => r.label === label);
}
