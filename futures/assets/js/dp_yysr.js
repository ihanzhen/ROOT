option = {
    tooltip: {
        trigger: 'axis'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['净利润','行业均值'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '-6',
        right: '-10',
        bottom: '10%',
        top:'15%',
        containLabel: true
    },
    toolbox: {
        show : false
    },          
    xAxis: [
        {
            type: 'category',
            data: ['1月','2月','3月','4月','5月','6月'],
            splitLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#aaa',          // 主标题文字颜色
                    fontSize: 9,
                }
            },
            axisLine:{
                lineStyle:{
                    color: '#666'
                }
            },
            axisTick:{
                lineStyle:{
                    color: '#666'
                }             
            } 
        }
    ],
    yAxis: [
        {
            type: 'value',
            min: -250,
            max: 250,
            interval: 50,
            splitLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#aaa',          // 主标题文字颜色
                    fontSize: 9,
                }
            },
            axisLine:{
                lineStyle:{
                    color: '#666'
                }
            },
            axisTick:{
                lineStyle:{
                    color: '#666'
                }             
            }           
        },
        {
            type: 'value',
            min: 0,
            max: 25,
            interval: 5,
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisLine:{
                show: false 
            },
            axisTick:{
                show: false              
            }                                     
        }
    ],
    series: [
        {
            name:'净利润',
            type:'bar',
            data:[-2.0, 4.9, -7.0, -23.2, 25.6, 76.7]
        },

        {
            name:'行业均值',
            type:'line',
            yAxisIndex: 1,
            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2]
        }
    ]
};
myChart = echarts.init(document.getElementById('main1'));
myChart.setOption(option);