type RGBA = { r: number; g: number; b: number; a: number };

function hexToRgba(hex) {
    if (!hex) {
        return "";
    }
    // 移除可能存在的 "#" 符号
    hex = hex.replace(/^#/, "");

    // 将16进制字符串分解成红、绿、蓝通道的十进制值
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = parseInt(hex.substring(6, 8), 16) / 255;

    // 创建并返回RGBA格式字符串
    return { r, g, b, a }
}

// 将 RGBA 转换为 rgba() 字符串
function rgbaToString(rgba: RGBA): string {
    const { r, g, b, a } = rgba;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// 解析 rgba() 字符串
function parseRgba(rgbaStr: string): RGBA {
    const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)/);
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
            a: match[4] ? parseFloat(match[4].toFixed(10)) : 1,
        };
    }
    throw new Error('Invalid RGBA color format');
}

// 插值计算两个 RGBA 颜色之间的中间颜色
function interpolateRgba(color1: RGBA, color2: RGBA, factor: number): RGBA {
    const r = Math.round(color1.r + factor * (color2.r - color1.r));
    const g = Math.round(color1.g + factor * (color2.g - color1.g));
    const b = Math.round(color1.b + factor * (color2.b - color1.b));
    const a = color1.a + factor * (color2.a - color1.a);
    return { r, g, b, a };
}

// 生成 x 段渐变色数组，支持十六进制和 rgba 颜色格式
function generateGradientColors(colors: string[], x: number): string[] {
    const gradientColors: string[] = [];
    const numColors = colors.length;
    const rgbaColors = colors.map(color => {
        if (color.startsWith('#')) {
            return hexToRgba(color);
        } else if (color.startsWith('rgba')) {
            return parseRgba(color);
        }
        throw new Error('Unsupported color format');
    });

    for (let i = 0; i < x; i++) {
        const position = i / (x - 1);
        const scaledPosition = position * (numColors - 1);
        const index1 = Math.floor(scaledPosition);
        const index2 = Math.min(index1 + 1, numColors - 1);
        const factor = scaledPosition - index1;

        // 插值计算颜色
        const interpolatedColor = interpolateRgba(rgbaColors[index1], rgbaColors[index2], factor);
        gradientColors.push(rgbaToString(interpolatedColor));
    }

    return gradientColors;
}

export {
    generateGradientColors
}