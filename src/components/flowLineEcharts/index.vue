<script setup lang="ts">
import * as echarts from "echarts";
import { ref } from "vue";
import FlowLinePath from "../flowLinePath/index.vue";
const props = defineProps({
    optionsProp: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

interface FlowLineConfig {
    path: string,
    clipPath: string,
    colorStep?: string | string[],
    radiusStep?: number | [number, number],
    lineLength?: number,
    dur?: number,
}
const flowLineConfigList = ref<FlowLineConfig[]>([]);

let myEcharts: echarts.ECharts | null = null;
const echartsRef = ref();
const setOptions = () => {
    if (!myEcharts) {
        myEcharts = echarts.init(echartsRef.value, null, { renderer: "svg" });
    }
    myEcharts.clear();
    myEcharts.off("finished");
    myEcharts.on("finished", () => {
        const { series } = props.optionsProp || { series: [] };
        let tempList = series.reduce((c, n) => n.type === "line" ? [...c, { ...(n.flowLineConfig || null) }] : c, []);
        tempList = tempList.filter((item) => item.enabled);
        let flowLineList: FlowLineConfig[] = [];
        tempList.forEach((item, index) => {
            try {
                if (item.enabled) {
                    let obj = {};
                    obj.path = echartsRef.value.querySelectorAll("path[stroke-linejoin='bevel']")[index].getAttribute("d");
                    obj.clipPath = echartsRef.value.querySelectorAll("clipPath")[index].querySelector("path").getAttribute("d");
                    Object.keys(item).forEach((key) => {
                        obj[key] = item[key];
                    })
                    flowLineList.push(obj);
                }
            } catch (e) {
                console.error(e);
            }
        })
        flowLineConfigList.value = flowLineList;
    });
    myEcharts.setOption(props.optionsProp);
}
defineExpose({
    setOptions,
})
</script>

<template>
    <div class="echarts-flow-line-main">
        <div class="echarts-content" ref="echartsRef" style="opacity: 1"></div>
        <template v-for="(config, index) in flowLineConfigList" :key="index">
            <flow-line-path v-bind="config" />
        </template>
    </div>
</template>

<style scoped lang="scss">
.echarts-flow-line-main {
    width: 100%;
    height: 100%;
    position: relative;
    .echarts-content {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
    }
}
</style>