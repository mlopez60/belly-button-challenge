const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";


// Intitialize the defaults and set up the charts
function init() {
    

    // Fetch the JSON data and console log it
    d3.json(url).then(function(data){
        let dropdownMenu = d3.select("#selDataset");

        // grabbing data
        let ids = data.names;

        ids.forEach(function(id){
            dropdownMenu.append("option").text(id).property("value", id);
        });

        let initsample = ids[0];

        // default charts
        charts(initsample);
        metadata(initsample);

});

};



// Chart function
function charts(selectedID) {
  // Get the chart data
  d3.json(url).then(function(data){

    //grab the data and filter for specific ID
    let sampledata = data.samples;
    // filter so that the data.id is equal to the selected ID
    let datafilter = sampledata.filter(id => id.id == selectedID);
    let results = datafilter[0];
    console.log(results)

    // grab specific data points used for the bar charts
    let sample_values = results.sample_values;
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;

    // bar chart

    let bardata = [{
        // pick the first 10, reversed 
        x: sample_values.slice(0,10).reverse(),
        // set up otu ID as labels for bar chart
        y:otu_ids.map(item => `OTU ${item}`).slice(0,10).reverse(),
        text:otu_labels.reverse(),
        type: 'bar',
        orientation: 'h'
    
      }];
    
      let barlayout = {
        height: 600,
        width: 800
      };
       // create the bar chart
      Plotly.newPlot("bar", bardata, barlayout); 


    // bubble chart
    let bubbledata = [{
        x: otu_ids.reverse(),
        y:sample_values.reverse(),
        text:otu_labels.reverse(),
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values
        }
    
      }];
    
      let bubblelayout = {
        height: 600,
        width: 800
      };
       // create the bubble chart
      Plotly.newPlot("bubble", bubbledata, bubblelayout);

  });
  

};

  // Metadata function
function metadata(selectedID){
    //grab the filtered data for the selected ID
    d3.json(url).then(function(data){
        let mdata = data.metadata;
        // make sure the data matches our ID
        let filteredmdata = mdata.filter(id => id.id == selectedID);
        let mdataresult = filteredmdata[0];
        console.log(mdataresult)
        d3.select("#sample-metadata").text("");

        //grab the data for display
        Object.entries(mdataresult).forEach(([key,value])=>{
            console.log(key,value);
            d3.select("#sample-metadata").append('h3').text(`${key}: ${value}`);
        })

    })

}

// Swapping data when new ID is selected

function optionChanged(newdata){
    charts(newdata)
    metadata(newdata)
}

// call init
init();