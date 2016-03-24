/* 
 * MagProduct model is hold the information that will housed for a particular product.
 * 
 * Author: Toby Blanks
 * 2/2016
 */

function MagHighChartData(){
    this.name = "";
    this.product = "";    
    this.group = "";
    this.color = "";
    this.deductibleColor = "";
    this.display = {};
    this.y = 0;
    this.d = 80;
    this.h = 20;
    this.productMag = null;
    this.id = "";
};

MagHighChartData.prototype.addMagProduct = function(magProduct){       
    this.name = magProduct.name;
    this.product = magProduct.product;
    this.group = magProduct.group;
    this.display = magProduct.display;
    this.productMag = magProduct;
    this.y = magProduct.y;
    this.d = magProduct.d;
    this.h = magProduct.h;
    this.color = magProduct.color;
    this.deductibleColor = magProduct.deductibleColor;
    this.id = magProduct.id;
};

MagHighChartData.prototype.toString = function(){
   var str = "{MagHighChartData: ";
       
   str += "{id: " + this.id + "}, ";
   str += "{name: " + this.name + "}, ";
   str += "{group: " + this.group + "}, ";
   str += "{y: " + this.y + "}, ";
   str += "{d: " + this.d + "}, ";
   str += "{h: " + this.h + "}, ";
       
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


