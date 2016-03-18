/* 
 * MagProduct model is hold the information that will housed for a particular product.
 * 
 * Author: Toby Blanks
 * 2/2016
 */

function MagProduct(){
    this.id = "";
    this.name = "";
    this.group = "";
    this.color = "";
    this.deductibleColor = "";
    this.occurrenceLimit = "1000000";
    this.aggregateLimit = "3000000";
    this.deductible = "0";
    this.y = 20;
    this.d = 80;
    this.h = 40;
    this.including = [];
    this.display = {};
}

MagProduct.prototype.buildDisplay = function(){    
    this.display = {};
    
    this.display["Occurrence Limit"] = "$" + this.occurrenceLimit;
    this.display["Aggregate Limit"] = "$" + this.aggregateLimit;
    this.display["Deductible"] = "$" + this.deductible;    
};

MagProduct.prototype.toString = function(){
   var length = this.including.length;
   var str = "{MagProduct: "; 
   
   str += "{id: " + this.id + "}, ";
   
   str += "{name: " + this.name + "}, ";
   str += "{group: " + this.group + "}, ";
   str += "{color: " + this.color + "}, ";
   str += "{deductibleColor: " + this.deductibleColor + "}, ";
   str += "{occurrenceLimit: " + this.occurrenceLimit + "}, ";
   str += "{aggregateLimit: " + this.aggregateLimit + "}, ";
   str += "{deductible: " + this.deductible + "}, ";
   str += "{y: " + this.y + "}, ";
   str += "{d: " + this.d + "}, ";
   str += "{h: " + this.h + "}, ";
   str += "{including: {";
   
   $.each(this.including, function(i, value){
      
      str += value;
            
      if(i < length - 1)
         str += ", ";       
   });

   str += "}}";
   
   this.buildDisplay();
   var displayLength = this.display.length;
   

   str += "{display: ";
    
   $.each(this.display, function(i, value){
      
      str += "{" + i + ": " + value + "}";
            
      if(i < displayLength - 1)
         str += ", ";       
   });
   
   str += "}}";
       
   return str;  
};






