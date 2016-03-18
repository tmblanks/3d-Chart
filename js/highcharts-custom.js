(function(HC) {

  var UNDEFINED, 
      each = HC.each,
      round = Math.round,
      cos = Math.cos,
      sin = Math.sin,
      deg2rad = Math.deg2rad;


  //1.1 WRAP METHODS

  //arc3dpath
  HC.wrap(HC.SVGRenderer.prototype, 'arc3dPath', function(proceed, shapeArgs) {
    // Run original proceed method
    var ret = proceed.apply(this, [].slice.call(arguments, 1));

    ret.zTop =  (ret.zOut + 1) / 100;

    if(shapeArgs.half > 0) {
      ret.zSide1 += 10000;
    } else {
      ret.zSide2 += 10000;
    }

    return ret;
  });
  
  Highcharts.wrap(Highcharts.seriesTypes.pie.prototype, 'drawPoints', function (proceed) {

        var options = this.options,
            states = options.states;

        // Do not do this if the chart is not 3D
        if (this.chart.is3d()) {
            // Set the border color to the fill color to provide a smooth edge
            this.borderWidth = options.borderWidth = options.edgeWidth || 1;
            this.borderColor = options.edgeColor = Highcharts.pick(options.edgeColor, options.borderColor, undefined);


            states.hover.borderColor = Highcharts.pick(states.hover.edgeColor, this.borderColor);
            states.hover.borderWidth = Highcharts.pick(states.hover.edgeWidth, this.borderWidth);
            states.select.borderColor = Highcharts.pick(states.select.edgeColor, this.borderColor);
            states.select.borderWidth = Highcharts.pick(states.select.edgeWidth, this.borderWidth);


            var prevPoint = this.data[0];

            each(this.data, function (point, i) {
                var pointAttr = point.pointAttr;
                    pointAttr[''].stroke = point.series.borderColor || point.color;
                    pointAttr['']['stroke-width'] = point.series.borderWidth;
                    pointAttr.hover.stroke = states.hover.borderColor;
                    pointAttr.hover['stroke-width'] = states.hover.borderWidth;
                    pointAttr.select.stroke = states.select.borderColor;
                    pointAttr.select['stroke-width'] = states.select.borderWidth;

                  point.shapeArgs.half = point.half;
                  
            });
        }

        proceed.apply(this, [].slice.call(arguments, 1));

        if (this.chart.is3d()) {
            each(this.points, function (point) {
                var graphic = point.graphic;

                // #4584 Check if has graphic - null points don't have it
                if (graphic) {
                    // Hide null or 0 points (#3006, 3650)
                    graphic[point.y ? 'show' : 'hide']();
                }
            });    
        }
    });

  //translate
  HC.wrap(HC.seriesTypes.pie.prototype, 'translate', function(proceed) {
    proceed.apply(this, [].slice.call(arguments, 1));

    // Do not do this if the chart is not 3D
    if (!this.chart.is3d()) {
      return;
    }

    var series = this,
      chart = series.chart,
      options = chart.options,
      seriesOptions = series.options,
      depth = seriesOptions.depth || 0,
      options3d = options.chart.options3d,
      alpha = options3d.alpha,
      beta = options3d.beta,
      z = seriesOptions.stacking ? (seriesOptions.stack || 0) * depth : series._i * depth;

    z += depth / 2;

    if (seriesOptions.grouping !== false) {
      z = 0;
    }

    each(series.data, function(point, i) {

      var shapeArgs = point.shapeArgs,
        angle;

      point.shapeType = 'arc3d';

      var ran = point.options.h;

      shapeArgs.z = z;
      shapeArgs.depth = depth * 0.75 + ran;
      shapeArgs.alpha = alpha;
      shapeArgs.beta = beta;
      shapeArgs.center = series.center;
      shapeArgs.ran = ran;
      if (i == 11 || i === 13) {
        shapeArgs.r = 120;
      }

      angle = (shapeArgs.end + shapeArgs.start) / 2;

      point.slicedTranslation = {
        translateX: round(cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)),
        translateY: round(sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad))
      };
    });
  });

  //1.2 CUSTOM METHODS
  HC.custom3d = {
    correctSlices: function() {
      var chart = this,
          series = chart.series[0],
          s = -1;

        each(series.points, function(p, i) {

          p.graphic.attr({
            translateY: s * p.shapeArgs.ran
          });

          p.graphic.side1.attr({
            translateY: s * p.shapeArgs.ran
          });

          p.graphic.side2.attr({
            translateY: s * p.shapeArgs.ran
          });

        });
    },
    addWatermark: function(url) {
        var chart = this,
            center = chart.series[0].center,
            left = chart.plotLeft,
            width = 105,
            height = 59,
            r = chart.renderer;

        if(chart.watermark) {
          chart.watermark.destroy();
        }

        chart.watermark = r.image(url, center[0] - (width / 2) + left, center[1] - (height / 2) + 10, width, height)
        .attr({
          zIndex:10
        })
        .css({
          'pointer-events': 'none'
        })
        .add();
    },
    addSlider: function(id) {
      var $slider = $('#' + id),
          chart = this;
  
      if ($slider.length) {
        $slider.slider({
          min: 0,
          max: 180,
          slide: function(event, ui) {
            chart.series[0].update({
              startAngle: ui.value
            },false);

            chart.series[1].update({
              startAngle: ui.value
            });
          },
        });
      }
    },
    parseData: function(json, config) {
        var i;

        var series = [{
          data: []
        },{
          center: ['50%','55%'],
          data: []
        }];

        each(json.series[0].data, function(point, i) {

            series[0].data.push($.extend({},point));

            point.color = point.deductibleColor;
            point.h = 0; //static height value default 20

            series[1].data.push($.extend({},point));
        });

      return series;

    }
  }

})(Highcharts);
