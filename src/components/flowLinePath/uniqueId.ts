// 生成唯一id
let uniqueId: number = 0;
export const renderedUniqueId = (): number => {
    uniqueId++;
    return uniqueId;
};
