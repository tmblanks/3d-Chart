$(function () {
	


	//1.1 CONFIG
	var HC = Highcharts,
		custom3d = HC.custom3d,
		config = {
			sliderID: 'slider',
			chartID: 'chart',
			watermark: 'images/watermark.png'
		};

	//1.2 HIGHCHARTS
	$(function (){ 
	   	var chart = new Highcharts.Chart({
		    chart: {
		      renderTo: config.chartID,
		      type: 'pie',
		      animation: false,
		      events: {
		        load: function() {
		        	custom3d.correctSlices.call(this);
		        	custom3d.addWatermark.call(this,config.watermark);
		        },
		        redraw: function() {
		        	custom3d.correctSlices.call(this);
		        	custom3d.addWatermark.call(this,config.watermark);
		        }
		      },
		      options3d: {
		        enabled: true,
		        alpha: 50,
		        beta: 0
		      }
		    },
		    tooltip:{
		        borderWidth: 1,
		        useHTML: true,
                        style : {
                            opacity: 1,
                            color: "#000000"
                        },
		    	formatter: function() {
		    		var d = this.point.display;
		    		return '<div class="tooltip" style="border: 2px solid ' + this.color + ';"><span style="font-size: 10px">' + this.key + '</span><br/><b>Occurrence Limit</b>' + d['Occurrence Limit'] + '<br/><b>Aggregate Limit: </b>' + d['Aggregate Limit'] + '<br/><b>Deductible: </b>' + d['Deductible']+ '</div>';
		    	}
		    },
		    plotOptions: {
		      pie: {
		        startAngle:0,
                        borderWidth: 1,
                        borderColor: '#FFFFFF',                
		        cursor: 'pointer',
                        innerSize: 150,
		        dataLabels:{
		        	enabled: false
		        },
		        depth: 45,
		        states: {
		        	hover: { 
		        		enabled: false
		        	}
		        }
		      },
                      series: {
                          point: {
                              events: {
                                  click: function(event){
                                      var point = event.point;
                                      
                                  }
                              }
                          }
                      }
		    },
		    series: custom3d.parseData(magChartSeries, config)
	  	},function(chart) {
	  		custom3d.addSlider.call(chart, config.sliderID); 
	  	});
	});
});