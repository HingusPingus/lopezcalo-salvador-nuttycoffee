export const createIdGenerator = (start = 1) => {
    let current = start;
    return () => current++;
};
