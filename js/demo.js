$(function () {
	


	//1.1 CONFIG
	var HC = Highcharts,
		each = HC.each,
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
		      animation: {
		      	duration: 900
		      },
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
		    	backgroundColor: "rgba(255,255,255,0)",
		        borderWidth: 0,
		        shadow:false,
		        useHTML: true,
		    	formatter: function() {
		    		var series = this.series.chart.series,
		    			p = this.point,
		    			x = p.x,
		    			d = p.display;
		    			//occuranceLimit = d && d['Occurrence Limit'] ? '<b>Occurrence Limit: </b>' + d['Occurrence Limit'] + '<br/>' : '',
		    			//aggregateLimit = d && d['Aggregate Limit'] ? '<b>Aggregate Limit: </b>' + d['Aggregate Limit'] + '<br/>' : '';
/**		    		
		    		txt = '<div class="highcharts-tooltip" style="background:#fff; padding:10px; border: 2px solid ' + this.color + ';"><span style="font-size: 10px">' + this.key + '</span><br/>' + occuranceLimit + ' ' + aggregateLimit; 
		    		
		    		each(series, function(s, i) {
		    			if(i === 0) { //skip main serie
		    				return;	
		    			}
		    			
		    			each(s.data, function(p, j) {
		    				if(p.x === x) {
		    					txt += '<b>Deductible: </b>' + p.value + '<br/>';
		    				}
		    			});
		    		});

		    		txt += '</div>'; 
		    		
		    		return txt; */
                            return '<div class="highcharts-tooltip" style="background:#fff; padding:10px; border: 2px solid ' + this.color + ';"><span style="font-size: 10px; color: #000000; font-family: arial;">' + this.key + '</span><br/><b>Occurrence Limit</b>' + d['Occurrence Limit'] + '<br/><b>Aggregate Limit: </b>' + d['Aggregate Limit'] + '<br/><b>Deductible: </b>' + d['Deductible'] + '</div>';                            

		    	}
		    },
		    plotOptions: {
		      pie: {
		      	allowPointSelect: false,
		        startAngle: -90,
		        depth: 35,
		        cursor: 'pointer',
		        borderColor: 'white',
                        innerSize: 150,                                                
		        dataLabels:{
		        	enabled: false
		        },
		        point: {
		        	events:{
		        		click: function(e) {
		        			//custom rotation 
		        			custom3d.rotateSlice.call(this, config, e);
		        			return false;
		        		}
		        	}
		        },
		        states: {
		        	hover: { 
		        		enabled: false
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