option_1 = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series : [
        {
            type: 'pie',
            radius : ['60%', '55%'],
            label: {
                normal: {
                    position: 'center'
                }  
            },
            data:[
                {
                    value:25,
                    itemStyle: {
                        normal: {
                            color: '#e74c3c'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{d} %',
                            textStyle: {
                                fontSize: 15,
                                color: '#e74c3c'
                            }
                        }
                    }
                },
                {
                    value:75,
                    tooltip: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: '#444'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '\n投资循环\n收益率',
                            textStyle: {
                                fontSize: 10,
                                color: '#fff',

                            }
                        }
                    }
                }
            ]
        }
    ]
};

myChart = echarts.init(document.getElementById('main-1'));
myChart.setOption(option_1);

option_2= {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series : [
        {
            type: 'pie',
            radius : ['60%', '55%'],
            label: {
                normal: {
                    position: 'center'
                }  
            },
            data:[
                {
                    value:60,
                    itemStyle: {
                        normal: {
                            color: '#27ae60'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{d} %',
                            textStyle: {
                                fontSize: 15,
                                color: '#27ae60'
                            }
                        }
                    }
                },
                {
                    value:40,
                    tooltip: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: '#444'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '最佳仓位',
                            textStyle: {
                                fontSize: 10,
                                color: '#fff'
                            }
                        }
                    }
                }
            ]
        }
    ]
};

myChart = echarts.init(document.getElementById('main-2'));
myChart.setOption(option_2);

option_3 = {
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series : [
        {
            type: 'pie',
            radius : ['60%', '55%'],
            label: {
                normal: {
                    position: 'center'
                }  
            },
            data:[
                {
                    value:45,
                    itemStyle: {
                        normal: {
                            color: 'yellow'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{d} %',
                            textStyle: {
                                fontSize: 15,
                                color: 'yellow'
                            }
                        }
                    }
                },
                {
                    value:55,
                    tooltip: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: '#444'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '当前仓位',
                            textStyle: {
                                fontSize: 10,
                                color: '#fff'
                            }
                        }
                    }
                }
            ]
        }
    ]
};

myChart = echarts.init(document.getElementById('main-3'));
myChart.setOption(option_3);
