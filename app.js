//Create function for plot
function myPlot(id) {

    // Get data from json
    d3.json("samples.json").then((data) => {
        console.log(data);

        // Filter sample data
        var value = data.samples.filter(i => i.id.toString() === id)[0];
        console.log(value);

        //Get top 10 sample data and id's and Labels
        var top10Sample = value.sample_values.slice(0, 10).reverse();

        var top10id = value.otu_ids.slice(0, 10).reverse();
        var otuId = top10id.map(d => "OTU " + d)

        var label = value.otu_labels.slice(0, 10);

        //Bar chart
        var trace1 = {
            type: "bar",
            x: top10Sample,
            y: otuId,
            orientation: "h",
            text: label,
        };
        // data1 variable
        var data_1 = [trace1];
        // plots layout
        var layout = {
            title: `Top 10 OTUs`,
            yaxis: {
                tickmode: "linear",
            }
        };
        //Bar plot
        Plotly.newPlot("bar", data_1, layout);

        // data3 gauge variable
        var data_3 = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: 10,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number"
            }
        ];

        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data_3, layout);
        

        //Bubble chart
        var trace2 = {
            x: value.otu_ids,
            y: value.top10Sample,
            mode: "markers",
            marker: {
                size: value.top10Sample,
                color: value.otu_ids
            },
            text: value.label
        };
        // data_2 variable
        var data_2 = [trace2];

        // bubble plots layout
        var layout_b = {
            xaxis: { title: "OTU ID" },
            height: 500,
            width: 1000
        };
        // bubble plots
        Plotly.newPlot("bubble", data_2, layout_b);
    });
}


//get sample data from json file
function metadata(id) {
    d3.json("samples.json").then((data) => {
        //get metadata 
        var metadata = data.metadata;
        console.log(metadata)
        //filter =id
        var dataFilter = metadata.filter(sample => sample.id.toString() === id)[0];
        //select ref info box
        var ref_info = d3.select("#sample-metadata")
        //clear data
        ref_info.html("")
        //display and append key-value
        Object.entries(dataFilter).forEach((key) => {
            ref_info.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

//Event function
function optionChanged(id) {
    myPlot(id);
    gauge(id);
    metadata(id);
}

//Render data
function init() {
    d3.json("samples.json").then((data) => {
        console.log(data)
        //drop down menu
        var dropdown = d3.select("#selDataset");
        //get ids on dropdown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });
        //call function for data and plots
        myPlot(data.names[0]);
        metadata(data.names[0]);
    });
}
init();
