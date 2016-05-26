/* 
 * MagProduct model is hold the information that will housed for a particular product.
 * 
 * Author: Toby Blanks
 * 2/2016
 */

function ChartSeries(){    
    this.magProductMap = {};
    this.type = "pie";
    this.name = "MagMutual Policy Coverages";
    this.data = new Array();
    this.PRACTICE_MEDICINE = 'Practice Of Medicine';
    this.BUSINESS_MEDICINE = 'Business Of Medicine';
    this.REGULATION_MEDICINE = 'Regulation Of Medicine';
};

ChartSeries.prototype.getPracticeMedicineData = function(){
    return this.magProductMap[this.PRACTICE_MEDICINE];
};

ChartSeries.prototype.getBusinessMedicineData = function(){
    return this.magProductMap[this.BUSINESS_MEDICINE];
};

ChartSeries.prototype.getRegulationMedicineData = function(){
    return this.magProductMap[this.REGULATION_MEDICINE];
};

ChartSeries.prototype.addMagHighChartData = function(chartData){    
    this.data.push(chartData);
    
    //Placing data in a hash map of arrays so that it will be ease to query 
    //data using product root.
    if(chartData.group in this.magProductMap){
        this.magProductMap[chartData.group].push(chartData);                
        console.info("updated map for group : " + chartData.group);
    }
    else{
        var dataArray = new Array();
        dataArray.push(chartData);
        this.magProductMap[chartData.group] = dataArray;
        console.info("added new map array: " + chartData.group);
    }
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




