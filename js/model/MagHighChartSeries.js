/* 
 * MagProduct model is hold the information that will housed for a particular product.
 * 
 * Author: Toby Blanks
 * 2/2016
 */

function MagHighChartSeries(){    
    this.series = new Array();
}

MagHighChartSeries.prototype.addChartSeries = function(chartSeries){    
    this.series.push(chartSeries);
};

MagHighChartSeries.prototype.getChartSeries = function(){    
    return this.series;
};

MagHighChartSeries.prototype.toString = function(){
   var str = "{MagHighChartSeries: ";
   
   var seriesLength = this.series.length;   
    
   $.each(this.series, function(i, value){
      
      str += "{Series " + i + ": " + value.toString(); + "}";
            
      if(i < seriesLength - 1)
         str += ", ";       
   });
   
   return str;
};




