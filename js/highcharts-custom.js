(function(HC) {

  var UNDEFINED, 
      NORMAL_STATE = '',
      extend = HC.extend,
      each = HC.each,
      merge = HC.merge,
      wrap = HC.wrap,
      inArray = HC.inArray,
      pick = HC.pick,
      round = Math.round,
      cos = Math.cos,
      sin = Math.sin,
      Pi = Math.PI,
      deg2rad = Pi * 2 / 360;


  //1.1 WRAP METHODS
  window.requestAnimFrame = function(){
      return (
          window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback){
              window.setTimeout(callback, 1000 / 60);
          }
      );
  }();


  //
   Highcharts.SVGRenderer.prototype.arc3d = function (attribs) {

        var wrapper = this.g(),
            renderer = wrapper.renderer,
            customAttribs = ['x', 'y', 'r', 'innerR', 'start', 'end'];

        /**
         * Get custom attributes. Mutate the original object and return an object with only custom attr.
         */
        function suckOutCustom(params) {
            var hasCA = false,
                ca = {};
            for (var key in params) {
                if (inArray(key, customAttribs) !== -1) {
                    ca[key] = params[key];
                    delete params[key];
                    hasCA = true;
                }
            }
            return hasCA ? ca : false;
        }

        attribs = merge(attribs);

        attribs.alpha *= deg2rad;
        attribs.beta *= deg2rad;
    
        // Create the different sub sections of the shape
        wrapper.top = renderer.path();
        wrapper.side1 = renderer.path();
        wrapper.side2 = renderer.path();
        wrapper.inn = renderer.path();
        wrapper.out = renderer.path();
        wrapper.sliceEdge = renderer.path();

        /**
         * Add all faces
         */
        wrapper.onAdd = function () {
            var parent = wrapper.parentGroup;
            wrapper.top.add(wrapper);
            wrapper.out.add(parent);
            wrapper.inn.add(parent);
            wrapper.side1.add(parent);
            wrapper.side2.add(parent);
            wrapper.sliceEdge.add(parent);
        };

        /**
         * Compute the transformed paths and set them to the composite shapes
         */
        wrapper.setPaths = function (attribs) {

            var paths = wrapper.renderer.arc3dPath(attribs),
                zIndex = paths.zTop * 100;

            wrapper.attribs = attribs;

            wrapper.top.attr({ d: paths.top, zIndex: paths.zTop });
            wrapper.inn.attr({ d: paths.inn, zIndex: paths.zInn });
            wrapper.out.attr({ d: paths.out, zIndex: paths.zOut });
            wrapper.side1.attr({ d: paths.side1, zIndex: paths.zSide1 });
            wrapper.side2.attr({ d: paths.side2, zIndex: paths.zSide2 });
            wrapper.sliceEdge.attr({ d: paths.sliceEdge, zIndex: paths.zsliceEdge });


            // show all children
            wrapper.zIndex = zIndex;
            wrapper.attr({ zIndex: zIndex });

            // Set the radial gradient center the first time
            if (attribs.center) {
                wrapper.top.setRadialReference(attribs.center);
                delete attribs.center;
            }
        };
        wrapper.setPaths(attribs);

        // Apply the fill to the top and a darker shade to the sides
        wrapper.fillSetter = function (value) {
            var darker = Highcharts.Color(value).brighten(-0.1).get(),
                stroke = this.stroke,
                strokeWidth = this['stroke-width'];
        
            this.fill = value;

            this.side1.attr({ fill: darker });
            this.side2.attr({ fill: darker });
            this.inn.attr({ fill: darker });
            this.out.attr({ fill: darker });
            this.top.attr({ fill: value });

         
            this.sliceEdge.attr({ 'stroke': stroke,'stroke-width': strokeWidth });
            return this;
        };

        // Apply the same value to all. These properties cascade down to the children
        // when set to the composite arc3d.
        each(['opacity', 'translateX', 'translateY', 'visibility'], function (setter) {
            wrapper[setter + 'Setter'] = function (value, key) {
                wrapper[key] = value;
                each(['out', 'inn', 'side1', 'side2', 'top','sliceEdge'], function (el) {
                    wrapper[el].attr(key, value);
                });
            };
        });

        /**
         * Override attr to remove shape attributes and use those to set child paths
         */
        wrap(wrapper, 'attr', function (proceed, params, val) {
            var ca;
            if (typeof params === 'object') {
                ca = suckOutCustom(params);
                if (ca) {
                    extend(wrapper.attribs, ca);
                    wrapper.setPaths(wrapper.attribs);
                }
            }
            return proceed.call(this, params, val);
        });

        /**
         * Override the animate function by sucking out custom parameters related to the shapes directly,
         * and update the shapes from the animation step.
         */
        wrap(wrapper, 'animate', function (proceed, params, animation, complete) {
            var ca,
                from = this.attribs,
                to;

            // Attribute-line properties connected to 3D. These shouldn't have been in the 
            // attribs collection in the first place.
            delete params.center;
            delete params.z;
            delete params.depth;
            delete params.alpha;
            delete params.beta;

            animation = pick(animation, this.renderer.globalAnimation);
        
            if (animation) {
                if (typeof animation !== 'object') {
                    animation = {};
                }
            
                params = merge(params); // Don't mutate the original object
                ca = suckOutCustom(params);
            
                if (ca) {
                    to = ca;
                    animation.step = function (a, fx) {
                        function interpolate(key) {
                            return from[key] + (pick(to[key], from[key]) - from[key]) * fx.pos;
                        }
                        if(fx.elem && fx.elem.setPaths) {
                            fx.elem.setPaths(merge(from, {
                                x: interpolate('x'),
                                y: interpolate('y'),
                                r: interpolate('r'),
                                innerR: interpolate('innerR'),
                                start: interpolate('start'),
                                end: interpolate('end')
                            }));
                        }
                    };
                }
            }
            return proceed.call(this, params, animation, complete);
        });

        // destroy all children
        wrapper.destroy = function () {
            this.top.destroy();
            this.out.destroy();
            this.inn.destroy();
            this.side1.destroy();
            this.side2.destroy();
            this.sliceEdge.destroy();

            Highcharts.SVGElement.prototype.destroy.call(this);
        };
        // hide all children
        wrapper.hide = function () {
            this.top.hide();
            this.out.hide();
            this.inn.hide();
            this.side1.hide();
            this.side2.hide();
            this.sliceEdge.hide();
        };
        wrapper.show = function () {
            this.top.show();
            this.out.show();
            this.inn.show();
            this.side1.show();
            this.side2.show();
            this.sliceEdge.show();
        };
        return wrapper;
    };


  //arc3dpath
  HC.wrap(HC.SVGRenderer.prototype, 'arc3dPath', function(proceed, shapeArgs) {
    // Run original proceed method
    var ret = proceed.apply(this, [].slice.call(arguments, 1));

    //hide the top borders in series below main.
    //ret.zTop =  ((ret.zOut + 1) / 100);
    ret.zTop = shapeArgs.seriesIndex > 0 ? 0 : ((ret.zOut + 1) / 100);
    //ret.zInn = shapeArgs.seriesIndex > 0 ? 0 : ((ret.zOut + 1) / 100);

    if(shapeArgs.end >= 1.571 && shapeArgs.end <= 3.142) {
      ret.zOut += 10000;
      ret.zsliceEdge = ret.zOut;
    }

    if (shapeArgs.half > 0) {
      ret.zSide1 += 10000;

    } else {
      ret.zSide2 += 10000;
    }

    var end = shapeArgs.end,
        start = shapeArgs.start;


    ret.sliceEdge = [];

    if(end > 1.5 * Pi ) {
       end -= 2 * Pi;
    } 

    if(end > 4.716) {
       end += 2 * Pi;
    }

    if(end >= -1.572 && end < 0) {

      ret.sliceEdge = ret.side2.slice(0,6);
      ret.zsliceEdge = ret.zSide1 + 1;

    } else if(end >= 0 && end < 1.572) {

      ret.sliceEdge = ret.side2.slice(0,6);
      ret.zsliceEdge = ret.zOut;

    } else if(end >= 1.572 && end < 3.144) {

      ret.sliceEdge = ret.side2.slice(0,6);
      ret.zsliceEdge = ret.zOut;

    } 


    if(start > 1.5 * Pi ) {
       start -= 2 * Pi;
    } 

    if(start > 4.716) {
       start += 2 * Pi;
    }

    if(start >= 0 && start < 1.572) {

      ret.sliceEdge = ret.sliceEdge.concat(ret.side1.slice(0,6));
      ret.zsliceEdge = ret.zOut;

    } else if(start >= 1.572 && start < 3.144) {

      ret.sliceEdge = ret.sliceEdge.concat(ret.side1.slice(0,6));
      ret.zsliceEdge = ret.zOut;

    } else if(start >= 3.144 && start < 4.716) {

      ret.sliceEdge = ret.sliceEdge.concat(ret.side1.slice(0,6));
      ret.zsliceEdge = ret.zOut;

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
                    point.shapeArgs.startAngle = point.series.startAngleRad;
                    point.shapeArgs.seriesIndex = point.series.index;
            });
        }

        var series = this,
                chart = series.chart,
                renderer = chart.renderer,
                groupTranslation,
                //center,
                graphic,
                //group,
                shadow = series.options.shadow,
                shadowGroup,
                pointAttr,
                shapeArgs,
                attr;

            if (shadow && !series.shadowGroup) {
                series.shadowGroup = renderer.g('shadow')
                    .add(series.group);
            }

            // draw the slices
            each(series.points, function (point,i) {
                if (point.y !== null) {
                    graphic = point.graphic;
                    shapeArgs = point.shapeArgs;
                    shadowGroup = point.shadowGroup;
                    pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
                    if (!pointAttr.stroke) {
                        pointAttr.stroke = pointAttr.fill;
                    }

                    // put the shadow behind all points
                    if (shadow && !shadowGroup) {
                        shadowGroup = point.shadowGroup = renderer.g('shadow')
                            .add(series.shadowGroup);
                    }

                    // if the point is sliced, use special translation, else use plot area traslation
                    /*groupTranslation = point.sliced ? point.slicedTranslation : {
                        translateX: 0,
                        translateY: 0
                    };*/

                    //group.translate(groupTranslation[0], groupTranslation[1]);
                    if (shadowGroup) {
                        shadowGroup.attr(groupTranslation);
                    }

                    // draw the slice
                    if (graphic) {
                        graphic
                            .setRadialReference(series.center)
                            .attr(pointAttr)
                            .animate(extend(shapeArgs, groupTranslation));
                    } else {
                        attr = { 'stroke-linejoin': 'round' };
                        if (!point.visible) {
                            attr.visibility = 'hidden';
                        }

                        if(point.series.index > 0) {
                          //attr.stroke = 'rgba(0,0,0,0)';
                          //attr['stroke-width'] = 0;
                        }

                        point.graphic = graphic = renderer[point.shapeType](shapeArgs)
                            .setRadialReference(series.center)
                            .attr(pointAttr)
                            .attr(attr)
                            .attr(groupTranslation)
                            .add(series.group)
                            .shadow(shadow, shadowGroup);
                    }
                }
            });  

        if (this.chart.is3d()) {
            each(this.points, function (point) {
                var graphic = point.graphic;

                // #4584 Check if has graphic - null points don't have it
                if (graphic) {
                    // Hide null or 0 points (#3006, 3650)
                    graphic[point.y ? 'show' : 'hide']();

                    //FIX Border issue
                    /*graphic.inn.attr({
                      'stroke-width': options.borderWidth,
                      'stroke': options.borderColor
                    });

                    graphic.top.attr({
                       'stroke-width': options.borderWidth,
                       'stroke': options.borderColor
                    });*/
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
          series = chart.series,
          r = chart.renderer,
          s = -1,
          path, g;

         each(series, function(serie, j) {
            each(serie.points, function(p, i) {
              g = p.graphic;
              path = g.out.d.split(' ');

              if(j === 0) {
                g.attr({
                  translateY: s * p.shapeArgs.ran
                });

                g.side1.attr({
                  translateY: s * p.shapeArgs.ran
                });

                g.side2.attr({
                  translateY: s * p.shapeArgs.ran
                });
              }
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

        chart.watermark = r.image(url, center[0] - (width / 2) + left, center[1] - (height / 2) + 7, width, height)
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
          chart = this,
          series = chart.series,
          len = series.length - 1,
          seriesOptions = series[0].options,
          animation = chart.options.chart && chart.options.chart.animation,
          duration = (animation && animation.duration) || 500,
          selectedPoint = seriesOptions.selectedPoint,
          redraw;

      if ($slider.length) {
        $slider.slider({
          min: -90,
          max: 270,
          animate: {
            enabled: true,
            duration: duration,
          },
          slide: function(event, ui) {
            each(series, function(s, i) {
              
              redraw = i === len ? true : false;

              s.update({
                startAngle: ui.value
              },redraw);
            });
          },
        });
      }
    },
    rotateSlice: function(config, e) {
      var point = this,
          pointX = point.x,
          sliced = point.selectedSlice,
          series = point.series,
          chart = series.chart,
          allSeries = series.chart.series,
          half = point.half,
          animation = chart.options.chart && chart.options.chart.animation,
          duration = (animation && animation.duration) || 500,
          startRad = point.shapeArgs.start,
          endRad = point.shapeArgs.end,
          middleRad = endRad - startRad,
          startAngle = series.options.startAngle,
          degress = ((startRad + middleRad / 2) * (180 / Pi) + 90) - startAngle,
          startAngleUpdated = half === 0 ? 180 - degress : 540 - degress,
          sliced = point.sliced ? false : true,
          startAngle = series.options.startAngle,
          endAngle = startAngle + 20,
          stop = false,
          start = new Date().getTime(),
          newAngle,
          diff,
          requestAnimationFrameID;

      if (startAngleUpdated < -90) {
        startAngleUpdated += 360;
      }

      if (startAngleUpdated > 270) {
        startAngleUpdated -= 360;
      }

      diff = startAngleUpdated - startAngle;

      each(allSeries, function(s, i) {
        each(s.data, function(p, j) {

          if(p.x === pointX) {
            p.update({
                sliced: true,
                correctTranslate: false 
            },false);
          } else {
            p.update({
              sliced: false,
              correctTranslate: false 
            },false);
          }
            
        });
      });

      $("#" + config.sliderID).slider('value', startAngleUpdated);
      
      populateSelectedPoint(point);      

        /*each(allSeries, function(s, i) {
          s.update({
            startAngle: startAngleUpdated
          });
        });*/

      function repeatOften() {

        var end = new Date().getTime(),
            step = (end - start) / duration,
            newAngle = startAngle + (step * diff);

          if (stop) {
            cancelAnimationFrame(requestAnimationFrameID);

            each(allSeries, function(s, i) {
              each(s.data, function(p, j) {

              if (p.x === pointX || p.correctTranslate) {

                var y = p.graphic.translateY || 0,
                    translateY;

                if(i === 0) {
                  translateY = sliced && p.correctTranslate !== true ? y + (p.series.options.slicedOffset || 10) : y;
                } else {
                  if(sliced || p.correctTranslate) {
                    translateY = y + (p.series.options.slicedOffset || 10) 
                  } 
                }

                p.graphic.attr({
                  translateY: translateY
                });
              }

            });
          });

          return;
        }

        //check time end or overshoot an angle
        if(end - start > duration || (diff > 0 && newAngle > startAngleUpdated) || (diff < 0 && newAngle < startAngleUpdated)) {
            stop = true;
            step = 1;

            each(allSeries, function(s, i) {
              s.update({
                startAngle: startAngleUpdated
              });
            });

        } else {
          each(allSeries, function(s, i) {
            s.update({
              startAngle: newAngle
            });
          });
        }

        requestAnimationFrameID = requestAnimationFrame(repeatOften);

      }

      requestAnimationFrameID = requestAnimFrame(repeatOften);

    },
    parseData: function(json, config) {
        var i;

        var series = [{
          data: []
        },{
          center: ['50%','54%'],
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
