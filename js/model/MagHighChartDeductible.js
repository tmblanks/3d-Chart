/* 
 * MagProduct model is hold the information that will housed for a particular 
 * deductible.  Since each series for deductibles will have to be the same height.
 * We will need to divide the deductibles into equal portions to show the correct 
 * view to end users. 
 * 
 * Author: Toby Blanks
 * 4/2016
 */

function MagHighChartDeductible(){    
    this.color = "";
    this.h = "";
    this.id = "";        
    this.totalDeductible = "";
    this.deductible = "";
}

MagHighChartDeductible.prototype.toString = function(){
   var str = "{MagHighChartDeductible: ";
   
   str += "{id: " + this.id + "}, ";   
   str += "{color: " + this.color + "}, ";
   str += "{h: " + this.h + "}, ";
   str += "{deductible: " + this.deductible + "}, ";
   str += "{totalDeductible: " + this.totalDeductible + "}} ";   
         
   return str;
};



