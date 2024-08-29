<script setup lang="ts">
import { renderedUniqueId } from "./uniqueId.ts";
import {PropType, computed, ref, onMounted, nextTick, watch} from "vue";
import { generateGradientColors } from "./renderGradientColor.ts"

type ColorStep = string | [string, string];
type RadiusStep = number | [number, number];
const props = defineProps({
    path: {
        type: String,
        default: "",
    },
    clipPath: {
        type: String,
        default: "",
    },
    // 流光的头尾色值，回自动根据头尾的色值计算渐变色
    colorStep: {
        type: Object as PropType<ColorStep>,
        default: () => {
            return ["#CF0B4499", "#CF0B4400"]
        }
    },
    // 流光的头尾宽度
    radiusStep: {
        type: Object as PropType<RadiusStep>,
        default: () => {
            return [2, 1]
        }
    },
    // 流光的长度，实际长度需要和dur，animateStep一同调整
    lineLength: {
        type: Number,
        default: 100,
    },
    // 单次动画的演出时间
    dur: {
        type: Number,
        default: 5,
    },
    // 两次动画之间的间隔，以毫秒为单位
    delay: {
        type: Number,
        default: 100,
    },
    // 多个球动画之间的间隔，当dur较慢时可调整该值，防止动画出现锯齿
    animateStep: {
        type: Number,
        default: 0.01
    }
});

const clipPathId = "clip" + renderedUniqueId();
const pathId = "path" + renderedUniqueId();

const list = computed(() => {
    let { colorStep, radiusStep, lineLength } = props;
    if (typeof colorStep === "string") {
        colorStep = new Array(lineLength).fill(colorStep);
    } else if (Array.isArray(colorStep)) {
        colorStep = generateGradientColors(colorStep, lineLength);
    }
    if (typeof radiusStep === "number") {
        radiusStep = new Array(lineLength).fill(radiusStep);
    } else if (Array.isArray(radiusStep) && radiusStep.length === 2) {
        radiusStep = divideArray(radiusStep[0], radiusStep[1], lineLength)
    }
    let count = 0;
    const result = [];
    while (result.length < lineLength) {
        result.push({
            index: count,
            color: colorStep[count],
            radius: radiusStep[count],
        })
        count++;
    }
    return result;
})

function divideArray(x: number, y: number, length: number): number[] {
    if (length < 2) {
        throw new Error('Length must be at least 2 to include both x and y.');
    }

    const step = (x - y) / length;
    const result: number[] = [];

    for (let i = 0; i < length; i++) {
        const value = x - i * step;
        result.push(parseFloat(value.toFixed(10))); // 保留10位小数并转换为浮点数
    }

    result.push(y); // 确保最后一个值是 y
    return result;
}

const reloadState = ref(0);

onMounted(() => {
    delayAnimate();
})

watch(reloadState, () => {
    delayAnimate();
})
const svgRef = ref();
let timer: null | number | NodeJS.Timeout = null;
const delayAnimate = () => {
    nextTick(() => {
        const animateMotion = svgRef.value.querySelectorAll("animateMotion");
        animateMotion[animateMotion.length - 1].addEventListener("endEvent", () => {
            if (typeof timer === "number") {
                clearInterval(timer);
                timer = null;
            }
            timer = setTimeout(() => {
                reloadState.value++;
            }, props.delay || 100)
        })
    })
}
</script>

<template>
    <svg v-if="path" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ref="svgRef" :key="reloadState">
        <clipPath :id="clipPathId"><path :d="clipPath" fill="#000"></path></clipPath>
        <g :clip-path="`url(#${clipPathId}))`">
            <path :d="path" :id="pathId" fill="none"></path>
            <template v-for="{ index, color, radius } in list" :key="index">
                <circle class="comet-core" :fill="color" :r="radius">
                    <animateMotion :dur="dur" :begin="index * animateStep">
                        <mpath :href="`#${pathId}`" />
                    </animateMotion>
                </circle>
            </template>
        </g>
    </svg>
</template>

<style scoped lang="scss"></style>
