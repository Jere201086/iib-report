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

    var data = {"OkPercent": 83.72727272727273, "KoPercent": 16.272727272727273};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.01, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Auto Infração Completo"], "isController": false}, {"data": [0.0, 500, 1500, "Obter Perfil do Usuário"], "isController": false}, {"data": [0.05, 500, 1500, "Consulta Genérica Detalhe"], "isController": false}, {"data": [0.02, 500, 1500, "Consulta Genérica Sumário"], "isController": false}, {"data": [0.0, 500, 1500, "Obter Calendário"], "isController": false}, {"data": [0.0, 500, 1500, "Obter Conteudo Documentos"], "isController": false}, {"data": [0.0, 500, 1500, "Validar Access Token"], "isController": false}, {"data": [0.015, 500, 1500, "Obter Monitoramento"], "isController": false}, {"data": [0.0, 500, 1500, "Converter Valor UPF"], "isController": false}, {"data": [0.025, 500, 1500, "Calcular Debito Remanescente"], "isController": false}, {"data": [0.0, 500, 1500, "Obter Localidade"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 179, 16.272727272727273, 13015.042727272737, 1035, 37028, 10553.5, 27244.999999999993, 33378.0, 35575.590000000004, 29.041370752699528, 76.73243739604509, 8.488026416096838], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Auto Infração Completo", 100, 4, 4.0, 23939.02, 2308, 37028, 23932.5, 35727.3, 36482.799999999996, 37026.35, 2.640124613881775, 40.97194950101645, 0.7202589962246218], "isController": false}, {"data": ["Obter Perfil do Usuário", 100, 25, 25.0, 13820.609999999999, 3406, 34511, 11707.0, 21188.9, 33260.799999999974, 34509.88, 2.841716396703609, 3.0805981813015064, 0.5952618819266837], "isController": false}, {"data": ["Consulta Genérica Detalhe", 100, 8, 8.0, 7340.23, 1035, 21213, 5988.0, 15161.9, 21028.95, 21212.91, 4.505519261094841, 12.873817301193963, 1.2750971502590673], "isController": false}, {"data": ["Consulta Genérica Sumário", 100, 9, 9.0, 7546.75, 1118, 21165, 6426.5, 15150.2, 21078.85, 21164.829999999998, 4.5160998961297025, 2.3291873419365037, 1.2641992531499797], "isController": false}, {"data": ["Obter Calendário", 100, 23, 23.0, 11851.58, 1876, 34156, 8230.0, 21167.3, 30783.0, 34140.70999999999, 2.8636884306987396, 2.3876002290950744, 0.6481611988115693], "isController": false}, {"data": ["Obter Conteudo Documentos", 100, 30, 30.0, 16145.190000000002, 4296, 35436, 12120.0, 33471.7, 34171.5, 35426.67, 2.7961860022928726, 11.303800366300367, 0.5868167694265023], "isController": false}, {"data": ["Validar Access Token", 100, 14, 14.0, 11618.489999999998, 1512, 34402, 7227.5, 30886.1, 32871.0, 34401.7, 2.841554898840646, 2.0409801055637646, 0.8352617427256195], "isController": false}, {"data": ["Obter Monitoramento", 100, 8, 8.0, 8977.86, 1299, 34073, 6541.0, 21128.2, 32398.849999999977, 34072.72, 2.8608210556429694, 1.2087527714203976, 0.5628888928622515], "isController": false}, {"data": ["Converter Valor UPF", 100, 29, 29.0, 16793.6, 5296, 34186, 16212.5, 21199.3, 32748.39999999998, 34184.11, 2.8451930463481947, 2.779620237858139, 0.6687592913335421], "isController": false}, {"data": ["Calcular Debito Remanescente", 100, 6, 6.0, 11695.1, 1313, 35311, 11082.0, 21197.0, 34405.54999999999, 35310.5, 2.7785495971103087, 1.3667533516254515, 2.244547096415671], "isController": false}, {"data": ["Obter Localidade", 100, 23, 23.0, 13437.039999999997, 3457, 35335, 10567.5, 29955.400000000056, 34200.099999999984, 35334.78, 2.794779352170146, 4.476914467524664, 0.5590104559682513], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 162, 90.50279329608938, 14.727272727272727], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:80 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 17, 9.497206703910615, 1.5454545454545454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 179, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 162, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:80 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 17, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Auto Infração Completo", 100, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Obter Perfil do Usuário", 100, 25, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 25, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Consulta Genérica Detalhe", 100, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:80 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Consulta Genérica Sumário", 100, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:80 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Obter Calendário", 100, 23, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 23, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Obter Conteudo Documentos", 100, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 30, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Validar Access Token", 100, 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Obter Monitoramento", 100, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Converter Valor UPF", 100, 29, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 29, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Calcular Debito Remanescente", 100, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Obter Localidade", 100, 23, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to treinamento.iib.eprocesso.parana:443 [treinamento.iib.eprocesso.parana/10.55.6.127] failed: Connection timed out: connect", 23, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
