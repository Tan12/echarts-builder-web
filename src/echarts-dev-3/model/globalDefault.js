define(function () {
    var platform = navigator.platform || '';
    return {
        // 全图默认背景
        backgroundColor: 'rgba(0,0,0,0)',

        // 默认色板
        // color: ['#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed',
        //         '#ff69b4','#ba55d3','#cd5c5c','#ffa500','#40e0d0',
        //         '#1e90ff','#ff6347','#7b68ee','#00fa9a','#ffd700',
        //         '#6699FF','#ff6666','#3cb371','#b8860b','#30e0e0'],

        // https://dribbble.com/shots/1065960-Infographic-Pie-chart-visualization
        // color: ['#5793f3', '#d14a61', '#fd9c35', '#675bba', '#fec42c',
        //         '#dd4444', '#d4df5a', '#cd4870'],
        // color: ['#928ea8', '#63869e', '#76b8d1', '#eab9b9', '#ebe4af'],
        // color: ['#bcd3bb', '#e88f70', '#e9b7a6', '#e1e8c8', '#bda29a', '#7b7c68', '#fbeabf', '#edc1a5'],
        // 浅色
        // color: ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'],
        // 深色
        color: ['#c23531', '#314656', '#61a0a8', '#dd8668', '#91c7ae', '#6e7074', '#61a0a8', '#bda29a', '#44525d', '#c4ccd3'],
        // color: ['#0088bb', '#a4d2aa', '#ea9695', '#eddf93', '#9bd6ec', '#f7c753', '#c78682', '#6bc3bc', '#e5362d', '#fbeabf'],

        // 默认需要 Grid 配置项
        grid: {},

        // 主题，主题
        textStyle: {
            decoration: 'none',
            // PENDING
            fontFamily: platform.match(/^Win/) ? 'Microsoft YaHei' : 'sans-serif',
            // fontFamily: 'Arial, Verdana, sans-serif',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
        },
        // 主题，默认标志图形类型列表
        // symbolList: [
        //     'circle', 'rectangle', 'triangle', 'diamond',
        //     'emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond'
        // ],
        animation: true,                // 过渡动画是否开启
        animationThreshold: 2000,       // 动画元素阀值，产生的图形原素超过2000不出动画
        animationDuration: 1000,        // 过渡动画参数：进入
        animationDurationUpdate: 300,   // 过渡动画参数：更新
        animationEasing: 'exponentialOut',    //BounceOut
        animationEasingUpdate: 'cubicOut'
    };
});