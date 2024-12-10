import FlowLineEcharts from "./components/flowLineEcharts/index.vue";
import FLowLinePath from "./components/flowLinePath/index.vue";

export {
    FlowLineEcharts,
    FLowLinePath,
}

const components = [FlowLineEcharts, FLowLinePath];
const install = function(App) {
    components.forEach((component) => {
        App.component(component.name,component);
    });
};
export default { install }

