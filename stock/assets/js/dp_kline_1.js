var axisData = [
    "2013/1/24", "2013/1/25", "2013/1/28", "2013/1/29", "2013/1/30",
    "2013/1/31", "2013/2/1", "2013/2/4", "2013/2/5", "2013/2/6", 
    "2013/2/7", "2013/2/8", "2013/2/18", "2013/2/19", "2013/2/20", 
    "2013/2/21", "2013/2/22", "2013/2/25", "2013/2/26", "2013/2/27", 
    "2013/2/28", "2013/3/1", "2013/3/4", "2013/3/5", "2013/3/6", 
    "2013/3/7", "2013/3/8", "2013/3/11", "2013/3/12", "2013/3/13"
];

option = {
    title: {
    	show: true,
        text: '周K线',
        left: 'left',
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        },						        
    },
    tooltip : {
        trigger: 'axis',
        showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        formatter: function (params) {
            var res = params[0].name;
            //res += '<br/>' + params[0].seriesName;
            res += '<br/>  开:' + toDecimal2(params[0].value[0]) + '  高:' + toDecimal2(params[0].value[3]);
            res += '<br/>  <span style="color:yellow">收:' + toDecimal2(params[0].value[1]) + '</span>  低:' + toDecimal2(params[0].value[2]);
            return res;
        },
        textStyle: {
            color: '#fff',
            fontSize: 11,
            padding: 0,
            lineheight:2
        }							        
    },

    toolbox: {
        show : false,

    },

    grid: {
        top:5,
        bottom:5,
        left:5,
        right:5
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : true,
            axisTick: {onGap:false},
            splitLine: {show:false},
            data : axisData,
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale:true,
            boundaryGap: [0.05, 0.05],
            splitArea : {show : false},
            splitNumber: 1,
            splitLine: {
            	show: false,
            	lineStyle:{
            		color:'#434343'
            	}
            }						            
        }
    ],
    series : [
        {
            name:'上证指数',
            type:'k',
            barMaxWidth: 100,
            
            data:[ // 开盘，收盘，最低，最高
                [2320.26,2302.6,2287.3,2362.94],
                [2300,2291.3,2288.26,2308.38],
                [2295.35,2346.5,2295.35,2346.92],
                [2347.22,2358.98,2337.35,2363.8],
                [2360.75,2382.48,2347.89,2383.76],
                [2383.43,2385.42,2371.23,2391.82],
                [2377.41,2419.02,2369.57,2421.15],
                [2425.92,2428.15,2417.58,2440.38],
                [2411,2433.13,2403.3,2437.42],
                [2432.68,2434.48,2427.7,2441.73],
                [2430.69,2418.53,2394.22,2433.89],
                [2416.62,2432.4,2414.4,2443.03],
                [2441.91,2421.56,2415.43,2444.8],
                [2420.26,2382.91,2373.53,2427.07],
                [2383.49,2397.18,2370.61,2397.94],
                [2378.82,2325.95,2309.17,2378.82],
                [2322.94,2314.16,2308.76,2330.88],
                [2320.62,2325.82,2315.01,2338.78],
                [2313.74,2293.34,2289.89,2340.71],
                [2297.77,2313.22,2292.03,2324.63],
                [2322.32,2365.59,2308.92,2366.16],
                [2364.54,2359.51,2330.86,2369.65],
                [2332.08,2273.4,2259.25,2333.54],
                [2274.81,2326.31,2270.1,2328.14],
                [2333.61,2347.18,2321.6,2351.44],
                [2340.44,2324.29,2304.27,2352.02],
                [2326.42,2318.61,2314.59,2333.67],
                [2314.68,2310.59,2296.58,2320.96],
                [2309.16,2286.6,2264.83,2333.29],
                [2282.17,2263.97,2253.25,2286.33]
            ]
        }
        
    ]
};
myChart = echarts.init(document.getElementById('main'));
myChart.setOption(option);

option2 = {
    title: {
    	show: true,
        text: '涨幅偏离 RD',
        left: 'left',
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        },						        
    },							
    tooltip : {
        trigger: 'axis',
        showDelay: 0,
        formatter: function (params) {
            var res = params[0].name;
            //res += '<br/>' + params[0].seriesName;
            //res += '<br/>  DIF:' + toDecimal2(params[1].value);
            //res += '<br/>  DEA:' + toDecimal2(params[1].value);
            res += '<br/>  <span style="color:yellow">偏离: '+toDecimal2((params[0].value-params[1].value)/params[0].value*100)+'%</span>';
            return res;
        },						        
        lineStyle:{
        	borderWidth: 1
        },
        textStyle: {
            color: '#fff',
            fontSize: 11,
            padding: 0,
            lineheight:2
        }
    },
    grid: {
        top:5,
        bottom:5,
        left:5,
        right:5
    },
    xAxis : [
        {
            type : 'category',
            position:'top',
            boundaryGap : true,
            axisLabel:{show:false},
            axisTick: {onGap:false},
            splitLine: {show:false},
            data : axisData,
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale:true,
            splitNumber: 1,						            
            axisLabel: {
                formatter: function (v) {
                    return Math.round(v/10000) + ' 万'
                }
            },
            splitArea : {show : false},
            splitLine: {
            	show: false,
            	lineStyle:{
            		color:'#434343'
            	}
            }
        }
    ],
    series : [
        {
        	itemStyle:{
        		normal:{
	        		lineStyle:{
	        			width:1,
	        			color:'yellow'
	        		}						        			
        		}
        	},
            name:'DIF',
            type:'line',
            symbol: 'none',
            data:[
                1, 2, 2, 1, 3, 
                2, 3, 3, 2, 5, 
                4, 3, 3, 4, 5, 
                5, 6, 5, 6, 1, 
                1, 2, 4, 5, 6, 
                6, 4, 5, 3, 3
            ]
        },
        {
        	itemStyle:{
        		normal:{
	        		lineStyle:{
	        			width:1,
	        			color:'white'
	        		}						        			
        		}
        	},
            name:'DEA',
            type:'line',
            symbol: 'none',
            data:[
                0.5, 1, 1, 0.5, 1.5, 
                1, 1.5, 1.5, 1, 2.5, 
                2, 1.5, 1.5, 2, 2.5, 
                2.5, 3, 2.5, 3, 0.5, 
                0.5, 1, 2, 2.5, 3, 
                3, 2, 2.5, 1.5, 1.5
	            ]
        }						        
    ]
};
myChart2 = echarts.init(document.getElementById('main2'));
myChart2.setOption(option2);

option3 = {
    title: {
    	show: true,
        text: 'KD',
        left: 'left',
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        },						        
    },							
    tooltip : {
        trigger: 'axis',
        showDelay: 0,
        formatter: function (params) {
            var res = params[0].name;
            //res += '<br/>' + params[0].seriesName;
            res += '<br/>  K:' + toDecimal2(params[1].value);
            res += '<br/>  D:' + toDecimal2(params[1].value);
            return res;
        },						        
        lineStyle:{
        	borderWidth: 1
        },
        textStyle: {
            color: '#fff',
            fontSize: 11,
            padding: 0,
            lineheight:2
        }
    },
    grid: {
        top:5,
        bottom:5,
        left:5,
        right:5
    },
    xAxis : [
        {
            type : 'category',
            position:'top',
            boundaryGap : true,
            axisLabel:{show:false},
            axisTick: {onGap:false},
            splitLine: {show:false},
            data : axisData,
        }
    ],
    yAxis : [
        {
            type : 'value',
            scale:true,
            splitNumber: 1,
            boundaryGap: [0.05, 0.05],
            axisLabel: {
                formatter: function (v) {
                    return Math.round(v/10000) + ' 万'
                }
            },
            splitArea : {show : false},
            splitLine: {
            	show: true,
            	lineStyle:{
            		color:'#434343'
            	}
            }
        }
    ],
    series : [
        {
        	itemStyle:{
        		normal:{
	        		lineStyle:{
	        			width:1,
	        			color:'yellow'
	        		}						        			
        		}
        	},
            name:'K',
            type:'line',
            symbol: 'none',
            data:[
                13560434, 8026738.5, 11691637, 12491697, 12485603, 
                11620504, 12555496, 15253370, 12709611, 10458354, 
                10933507, 9896523, 10365702, 10633095, 9722230, 
                12662783, 8757982, 7764234, 10591719, 8826293, 
                11591827, 11153111, 14304651, 11672120, 12536480, 
                12608589, 8843860, 7391994.5, 10063709, 7768895.5
            ]
        },
        {
        	itemStyle:{
        		normal:{
	        		lineStyle:{
	        			width:1,
	        			color:'white'
	        		}						        			
        		}
        	},
            name:'D',
            type:'line',
            symbol: 'none',
            data:[
                6921859, 10157810, 8148617.5, 7551207, 11397426, 
                10478607, 8595132, 8541862, 9181132, 8570842, 
                10759351, 7335819, 6699753.5, 7759666.5, 6880135.5, 
                7366616.5, 7313504, 7109021.5, 6213270, 5619688, 
                5816217.5, 6695584.5, 5998655.5, 6188812.5, 9538301,
                8224500, 8221751.5, 7897721, 8448324, 6525151
	            ]
        }						        
    ]
};
myChart3 = echarts.init(document.getElementById('main3'));
myChart3.setOption(option3);


option4 = {
    title : {
        //text: '综合对比',
        //subtext: '纯属虚构',
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        }       
    },
    tooltip : {
        trigger: 'axis',
        textStyle: {
            fontSize: 11,
            fontWeight: 'normal',
            color: '#ccc'          // 主标题文字颜色
        },        

    },
    legend: {
        show:false,
        data:['意向','预购','成交']        
    },
    toolbox: {
        show : false,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['1','2','3','4','5','6','7'],
            axisLabel:{
                textStyle: {
                    fontSize: 11,
                    fontWeight: 'normal',
                    color: '#ccc'          // 主标题文字颜色
                }         
            },
            splitArea : {show : false},
            splitLine: {show:false},    
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel:{
                textStyle: {
                    fontSize: 11,
                    fontWeight: 'normal',
                    color: '#ccc'          // 主标题文字颜色
                }              
            },
            splitArea : {show : false},
            splitLine: {show:false},           
        }
    ],
    series : [
        {
            name:'成交',
            type:'line',
            smooth:true,
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: 'orange',
                        type: 'default'
                    },
                    lineStyle:{
                        color:'orange'
                    },
                    
                }               
            },
            data:[10, 12, 21, 54, 260, 530, 610],           
        },
        {
            name:'预购',
            type:'line',
            smooth:true,
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#e74c3c',
                        type: 'default'
                    },
                    lineStyle:{
                        color:'#e74c3c'
                    },
                }
            },
            data:[30, 82, 134, 291, 390, 850, 920]
        },
        /*{
            name:'意向',
            type:'line',
            smooth:true,
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#27ae60',
                        type: 'default'
                    },
                    lineStyle:{
                        color:'#27ae60'
                    }
                }
            },
            data:[1320, 1132, 601, 234, 120, 90, 20]
        }*/
    ]
};
myChart4 = echarts.init(document.getElementById('main4'));
myChart4.setOption(option4);


//myChart.connect([myChart2, myChart3]);
//myChart2.connect([myChart, myChart3]);
//myChart3.connect([myChart, myChart2]);

function toDecimal2(x) {    
    var f = parseFloat(x);    
    if (isNaN(f)) {    
        return false;    
    }    
    var f = Math.round(x*100)/100;    
    var s = f.toString();    
    var rs = s.indexOf('.');    
    if (rs < 0) {    
        rs = s.length;    
        s += '.';    
    }    
    while (s.length <= rs + 2) {    
        s += '0';    
    }    
    return s;    
}   