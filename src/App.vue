<script setup lang="ts">
import {onMounted, ref} from "vue";
import FlowLineEcharts from "./components/flowLineEcharts/index.vue";
// import { FlowLineEcharts } from "../dist/flow-line-echarts-vue3.es"

const optionsProps = {
    xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    yAxis: {},
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            symbol: "none",
            smooth: true,
            flowLineConfig: {
                enabled: true,
                colorStep: ["#CF0B4499", "#CF0B4400"],
                radiusStep: [2, 2],
                lineLength: 100,
                dur: 4,
                delay: 0,
            }
        },
        {
            data: [420, 332, 201, 134, 590, 630, 720],
            type: "line",
            symbol: "none",
            smooth: true,
            flowLineConfig: {
                enabled: true,
                colorStep: ["#1591E8FF", "#1591E800"],
                radiusStep: [2.5, 1.5],
                lineLength: 100,
                dur: 4,
                delay: 1500,
            }
        },
    ]
}
const flowLineRef = ref();

onMounted(() => {
    flowLineRef.value.setOptions();
})
</script>

<template>
    <flow-line-echarts :options-prop="optionsProps" ref="flowLineRef" class="echarts-demo"></flow-line-echarts>
</template>

<style scoped>
.echarts-demo {
    width: 400px;
    height: 400px;
}
</style>
