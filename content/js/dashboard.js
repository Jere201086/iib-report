/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.66666666666667, "KoPercent": 8.333333333333334};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.72, 500, 1500, "Obter Perfil do Usuário"], "isController": false}, {"data": [0.0, 500, 1500, "Auto Infração Completo"], "isController": false}, {"data": [0.0, 500, 1500, "Obter Detalhes Documentos"], "isController": false}, {"data": [0.0, 500, 1500, "Consulta Genérica Detalhe"], "isController": false}, {"data": [0.965, 500, 1500, "Obter Calendário"], "isController": false}, {"data": [0.0, 500, 1500, "Consulta Genérica Sumário"], "isController": false}, {"data": [0.225, 500, 1500, "Obter Conteudo Documentos"], "isController": false}, {"data": [0.49, 500, 1500, "Validar Access Token"], "isController": false}, {"data": [0.06, 500, 1500, "Obter Monitoramento"], "isController": false}, {"data": [0.69, 500, 1500, "Converter Valor UPF"], "isController": false}, {"data": [0.06, 500, 1500, "Calcular Debito Remanescente"], "isController": false}, {"data": [0.045, 500, 1500, "Obter Localidade"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 100, 8.333333333333334, 7299.674166666667, 70, 52089, 3257.0, 18450.40000000003, 33276.70000000001, 47286.66, 22.9454281234464, 52.21563802631076, 7.988325318367815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Obter Perfil do Usuário", 100, 0, 0.0, 1602.0800000000002, 162, 12798, 440.0, 3298.3000000000065, 12474.199999999993, 12796.779999999999, 3.3027280533720855, 1.6571373501387145, 0.9224416242816567], "isController": false}, {"data": ["Auto Infração Completo", 100, 0, 0.0, 35300.88, 7935, 52089, 36252.5, 47617.9, 49540.05, 52072.969999999994, 1.9121190102872003, 30.682787821714022, 0.5433853828062258], "isController": false}, {"data": ["Obter Detalhes Documentos", 100, 100, 100.0, 1343.09, 148, 12898, 828.5, 2046.4000000000008, 2191.4499999999994, 12890.229999999996, 3.0196883681604056, 1.2886756024278294, 1.2061059986109433], "isController": false}, {"data": ["Consulta Genérica Detalhe", 100, 0, 0.0, 17175.030000000002, 15209, 19407, 17093.5, 19173.7, 19256.0, 19406.9, 4.939491232403062, 14.064429488762658, 1.519472400592739], "isController": false}, {"data": ["Obter Calendário", 100, 0, 0.0, 553.56, 70, 12304, 170.5, 405.3000000000003, 484.6999999999997, 12302.76, 3.3821490174857103, 0.805605436381777, 0.9941668498664051], "isController": false}, {"data": ["Consulta Genérica Sumário", 100, 0, 0.0, 5108.110000000002, 3235, 7513, 5570.5, 7105.8, 7210.999999999999, 7511.44, 11.984659635666347, 3.58860970457814, 3.6866872902684564], "isController": false}, {"data": ["Obter Conteudo Documentos", 100, 0, 0.0, 5768.630000000001, 369, 14227, 2269.5, 13123.5, 13450.55, 14224.179999999998, 2.9836496001909536, 13.602295358933048, 0.8945121359947488], "isController": false}, {"data": ["Validar Access Token", 100, 0, 0.0, 1491.9899999999998, 125, 13177, 887.0, 3215.6000000000004, 3413.5499999999993, 13083.709999999952, 3.3823778116015557, 1.2749978860138678, 1.1560861660747506], "isController": false}, {"data": ["Obter Monitoramento", 100, 0, 0.0, 5470.620000000003, 774, 19187, 4260.0, 11569.0, 16029.099999999968, 19183.859999999997, 5.04133897963299, 1.0674444507461183, 1.0781769888082275], "isController": false}, {"data": ["Converter Valor UPF", 100, 0, 0.0, 1390.19, 158, 13640, 410.5, 3570.6000000000017, 6911.749999999969, 13636.499999999998, 3.3563804792911323, 0.7507279150164462, 1.111145490702826], "isController": false}, {"data": ["Calcular Debito Remanescente", 100, 0, 0.0, 6933.759999999999, 793, 19435, 7200.0, 16189.300000000023, 18775.199999999997, 19434.73, 4.935834155972359, 1.6976570212240867, 4.241732477788746], "isController": false}, {"data": ["Obter Localidade", 100, 0, 0.0, 5458.149999999999, 271, 13540, 6273.0, 7495.5, 7989.049999999999, 13491.449999999975, 3.3980087668626187, 4.188112172516905, 0.8826858710795474], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 100, 100.0, 8.333333333333334], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 100, "500/Internal Server Error", 100, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Obter Detalhes Documentos", 100, 100, "500/Internal Server Error", 100, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
