export const calculateOrbitPoint = (index, total) => {
    const pointProgress = total <= 1 ? 0.5 : index / (total - 1);
    const x = 44 + pointProgress * 912;
    const y = 75 - Math.sin(pointProgress * Math.PI) * 38;
    const rotation = -20 + pointProgress * 40;

    return {
        left: `${x / 10}%`,
        top: `${(y / 132) * 100}%`,
        rotation,
    };
};

export const calculateVisibleStart = (index, maxIndex, visibleStepLimit) => {
    const windowEnd = maxIndex - Math.floor((maxIndex - index) / visibleStepLimit) * visibleStepLimit;
    return Math.max(0, windowEnd - visibleStepLimit + 1);
};