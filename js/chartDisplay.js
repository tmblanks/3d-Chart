/* 
 * This is utility used to display the different Lines Of Business, so 
 * that if the information may change, options will be dynamically generated 
 * based on database and/or file.
 * 
 * Toby Blanks
 * 5/2016
 */

function writePracticeData() {
    var series = this.magChartSeries.getChartSeries();
    var dataArray = series[0].getPracticeMedicineData();
    var data = dataArray[0];
    var includingNames = data.productMag.including;
    var htmlString = "";

    $.each(includingNames, function (index, value) {
        htmlString += "<li class=\"list-group-item\"> ";
        htmlString += "<span class=\"box-size default-box-color\">&nbsp;</span>&nbsp;";
        htmlString += value;
        htmlString += "</li>";
    });

    return htmlString;
}

function writeBusinessData() {
    var series = this.magChartSeries.getChartSeries();
    return writeHTMLInfo(series[0].getBusinessMedicineData());
}

function writeRegulationData() {
    var series = this.magChartSeries.getChartSeries();
    return writeHTMLInfo(series[0].getRegulationMedicineData());
    
}

function writeHTMLInfo(dataArray) {
    var htmlString = "";

    $.each(dataArray, function (index, data) {
        var color = data.color;

        if (color.startsWith('#')) {
            color = data.color.substr(1);
        }

        htmlString += "<li class=\"list-group-item\"> ";
        htmlString += "<span class=\"box-size c-" + color + "\">&nbsp;</span>&nbsp;";
        htmlString += data.name;
        htmlString += "</li>";
    });

    return htmlString;
}
