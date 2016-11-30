option = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data: [
            //'系统收益',
            '用户收益'],
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }        
    },
    grid: {
        //left: '-6',
        //right: '10',
        left: '-6',
        right: '10',
        bottom: '10%',
        top:'15%',
        containLabel: true
    },    
    toolbox: {
        show : false
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : [
                //'09/13', //1
                //'09/14', //2
                //'09/15', //3
                //'09/16', //4
                //'09/17', //5
                //'09/18', //6
                //'09/19', //7
                //'09/20', //8
                //'09/21', //9
                //'09/22', //10
                //'09/23', //12
                //'09/24', //13
                //'09/25', //14
                //'09/26', //15
                //'09/27', //16
                //'09/28', //17
                //'09/29', //18
                //'09/30', //19
                //'10/01'  //20
            ],
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
    yAxis : [
        {
            type : 'value',
            splitLine: {
                show: false,
                lineStyle:{
                    color:'#ccc'
                }
            },
            axisLabel: {
                formatter: '{value}',
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
    series : [
        //{
        //    name:'系统收益',
        //    type:'line',
        //    smooth:true,
        //    itemStyle: {normal: {areaStyle: {type: 'default'}}},
        //    data:[
        //        10, 12, 21, 54, 260, 830, 710, 666, 555, 444,
        //        333, 222, 111, 0, 111, 333, 555, 777, 999, 777
        //    ]
        //},
        {
            name:'用户收益',
            type:'line',
            smooth:true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:[
                //30, 182, 434, 791, 390, 300, 200, 100, 50, 100, 
                //200, 300, 400, 500, 400, 300, 200, 100, 50, 0 
            ]
        }
    ]
};

myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);