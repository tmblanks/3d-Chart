/* 
 * Base javascript file that will be used to load products and init application.
 * 
 * Author: Toby Blanks
 * 2/2016
 */


var magChartSeries = null;
var defaultH = 20;
var defaultD = 80;
var defaultY = 20;
        
function loadMappingData(){
    var chartSeries = new ChartSeries();
    var magSeries = new MagHighChartSeries();
    
    jQuery.ajaxSetup({async:false});

    $.getJSON("data/MagProductsMapping.json", function (data) {
        
        $.each( data.products, function( i, product) {
            
            var magProduct = loadMagProduct(product);
            var chartData = new MagHighChartData();
            
            chartData.addMagProduct(magProduct);
            
            chartSeries.addMagHighChartData(chartData);
            
        });
        
        magSeries.addChartSeries(chartSeries);
        magChartSeries = magSeries;
        //console.info(JSON.stringify(magChartSeries));
    });
    
}

function loadMagProduct(product){
   var magProduct = new MagProduct();
   
   magProduct.id = product.id;
   magProduct.sliceDisplay = product.sliceDisplay;   
   magProduct.product = product.product;
   magProduct.name = product.name;
   magProduct.group = product.group;
   magProduct.color = product.color;
   magProduct.deductibleColor = product.deductibleColor;   
   magProduct.including = product.including;
   magProduct.loadDeductibles(product.deductibles);
   magProduct.deductible = product.deductible;
   
   
   if(typeof product.h === "undefined"){
      magProduct.h = defaultH;
   }
   else{
      magProduct.h = product.h;
   }
   
   if(typeof product.d === "undefined"){
      magProduct.d = defaultD;
   }
   else{ 
      magProduct.d = product.d;
   }
   
   if(typeof product.y === "undefined"){
      magProduct.y = defaultY;
   }
   else{ 
      magProduct.y = product.y;
   }
   
   magProduct.buildDisplay();
   
   return magProduct;
}

function populateSelectedPoint(point){
    
    $('#lob').html(point.group);
    $('#product').html(point.product);
    $('#riskExposure').html(point.name);
    $('#occurrenceLimit').html("$" + $.number(point.productMag.occurrenceLimit));
    $('#aggregateLimit').html("$" + $.number(point.productMag.aggregateLimit));
    $('#deductible').html("$" + $.number(point.productMag.deductible));    
}

loadMappingData();


