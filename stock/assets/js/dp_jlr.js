option = {
    color:['#e84c3d'],
    tooltip: {
        trigger: 'axis',
        formatter: "{b}年<br/>{c}"
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
        show:false,
        data:['净资产收益率'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '0',
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
            data: ['2014','2015','2016'],
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
            /*min: -1,
            max: 1,
            interval: 0.5,*/
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
            name:'净资产收益率',
            type:'bar',
            data:[0.3, 0.4, 0.1],
            barWidth: 15
        }
    ]
};
myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);

option1 = {
    color: ['#f08c2e'],
    tooltip: {
        trigger: 'axis',
        formatter: "{b}年<br/>{c}"
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
        show:false,
        data:['毛利率'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '0',
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
            data: ['2014','2015','2016'],
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
            /*min: -1,
            max: 1,
            interval: 0.5,*/
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
            name:'毛利率',
            type:'bar',
            data:[-0.2, 0.5, 0.1],
            barWidth: 15
        },
    ]
};
myChart = echarts.init(document.getElementById('main1'));
myChart.setOption(option1);

option2 = {
    color: ['#2fcc71'],
    tooltip: {
        trigger: 'axis',
        formatter: "{b}季度<br/>{c}"
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
        show:false,
        data:['经营活动现金净流量增长率'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '0',
        right: '-10',
        bottom: '10%',
        top:'10',
        containLabel: true
    },
    toolbox: {
        show : false
    },          
    xAxis: [
        {
            type: 'category',
            data: ['3','4','1','2','3','4'],
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
            /*min: -1,
            max: 1,
            interval: 0.5,*/
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
            /*min: 0,
            max: 25,
            interval: 5,*/
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
            name:'经营活动现金净流量增长率',
            type:'bar',
            data:[0.5, 0.49, 0.9,0.5, 0.49, 0.9],
            barWidth: 10
        }
    ]
};
myChart = echarts.init(document.getElementById('main2'));
myChart.setOption(option2);

option3 = {
    color:['#1bbc9d'],
    tooltip: {
        trigger: 'axis',
        formatter: "{b}季度<br/>{c}"
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
        show:false,
        data:['净利润现金含量'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '0',
        right: '-17',
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
            data: ['3','4','1','2','3','4'],
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
            /*min: -250,
            max: 250,
            interval: 100,*/
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
            name:'净利润现金含量',
            type:'bar',
            data:[153, 213, 111,153, 213, 111],
            barWidth: 10
        }
    ]
};
myChart = echarts.init(document.getElementById('main3'));
myChart.setOption(option3);

option4 = {
    color:['#3398DB'],
    tooltip: {
        trigger: 'axis',
        formatter: "{b}季度<br/>{c}"
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
        show:false,
        data:['收入增长率'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '0',
        right: '-15',
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
            data: ['3','4','1','2','3','4'],
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
            /*min: -1,
            max: 1,
            interval: 0.5,*/
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
            name:'收入增长率',
            type:'bar',
            data:[0.3, 0.4, 0.1,0.3, 0.4, 0.1],
            barWidth: 10
        }
    ]
};
myChart = echarts.init(document.getElementById('main4'));
myChart.setOption(option4);

option5 = {
    color:['#df77d7'],
    tooltip: {
        trigger: 'axis',
        formatter: "{b}季度<br/>{c}"
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
        show:false,
        data:['净利润增长率'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }         
    },
    grid: {
        left: '0',
        right: '-15',
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
            data: ['3','4','1','2','3','4'],
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
            /*min: -1,
            max: 1,
            interval: 0.5,*/
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
            name:'净利润增长率',
            type:'bar',
            data:[0.3, 0.4, 0.1,0.3, 0.4, 0.1],
            barWidth: 10
        }
    ]
};
myChart = echarts.init(document.getElementById('main5'));
myChart.setOption(option5);