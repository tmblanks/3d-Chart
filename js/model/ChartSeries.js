/* 
 * MagProduct model is hold the information that will housed for a particular product.
 * 
 * Author: Toby Blanks
 * 2/2016
 */

function ChartSeries(){    
    this.type = "pie";
    this.name = "MagMutual Policy Coverages";
    this.data = new Array();
};

ChartSeries.prototype.addMagHighChartData = function(chartData){    
    this.data.push(chartData);
};

ChartSeries.prototype.toString = function(){
   var str = "{ChartSeries: ";
       
   str += "{type: " + this.type + "}, ";
   str += "{name: " + this.name + "}, ";
   str += "{data: " ;
   
   var dataLength = this.data.length;
       
   $.each(this.data, function(i, value){
      
      str += "{" +  value.toString() + "}";
            
      if(i < dataLength - 1)
         str += ", ";       
   });
      
   str += "}";
   
   return str;
};




