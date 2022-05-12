let w = 800;
let h = 500;
let xpadding = 100;
let ypadding = 50;
let padding = 50;
let graphHeight = h-padding*2;
let formatYear = d3.timeParse("%Y");
let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]

let viz = d3.select("#container")
          .append("svg")
          .style("width", w)
          .style("height", h)
          .style("background-color", "lightgrey")
;

d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/venice_jury.json").then(function(incomingData){
    console.log(incomingData);
    incomingData = incomingData.map(d=>{
      d.year = formatYear(d.year)
      return d;
    })
    console.log(incomingData);
  //
    incomingData = incomingData.map(function(data){
      let correspondingDatapoint = continentData.find(function(things){
          // console.log(data);
          if(things.country == data.nationality){
            return true
          } else {
            return false
          }
        })
      console.log(correspondingDatapoint);
      console.log(correspondingDatapoint.continent);
      data.continent = correspondingDatapoint.continent
      return data
    })
  // })
    // console.log(incomingData);
  //
  //
    // x scale & AXIS
    let extent = d3.extent(incomingData, d=>d.year);
    let xScale = d3.scaleTime().domain(extent).range([xpadding, w-xpadding]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.append("g")
                          .attr("class", "xaxisgroup")
                          .attr("transform", "translate("+(xpadding/2)+","+(h-ypadding)+")")
    ;
    xAxisGroup.call(xAxis);
  //
    //y scale & axis
    let continentScale = d3.scaleBand().domain(continents).range([ypadding, h-ypadding]);
    // console.log("Europe: " continentScale("Europe"));
    // console.log("Europe: " continentScale("Europe"));
    let continentAxis = d3.axisLeft(continentScale);
    let continentAxisGroup = viz.append("g")
                                  .attr("class", "continentaxisgroup")
                                  .attr("transform", "translate("+(xpadding)+",0)")
    ;
    continentAxisGroup.call(continentAxis);
    // console.log(continentScale.bandwidth());

    let graphGroup = viz.append("g").attr("class", "graphgroup")

    let individualDataGroup = graphGroup.selectAll(".individualData").data(incomingData).enter()
                                              .append("g")
                                              .sort((a,b)=>{
                                                return d3.ascending(a.guessed_gender, b.guessed_gender)
                                              })
                                              .attr("class", "individualData")
    ;
  //
    individualDataGroup.append("circle")
                        .attr("class", "datapoint")
                        .attr("r", 5)
                        .attr("fill", function(d,i){
                          if (d.guessed_gender == "male"){
                            return "DodgerBlue"
                          } else {
                            return "deeppink"
                          }
                        })
                        // .attr("stroke", "black")
                        // .attr("stroke-width", 1)
    ;
  //
    incomingData = incomingData.map(function(datapoint){
      datapoint.x = xScale(datapoint.year)+xpadding/2;
      datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
      return datapoint
    })
  //
  //   console.log(incomingData.length);
    let simulation = d3.forceSimulation(incomingData)
                        .force("forceX", d3.forceX(function(d){
                          return xScale(d.year)+xpadding/2
                        }))
                        .force("forceY", d3.forceY(function(d){
                          return continentScale(d.continent)+continentScale.bandwidth()/2
                        }))
                        .force("collide", d3.forceCollide(6))
                        .on("tick", simulationRan)
    ;
    function simulationRan(){
      // console.log(incomingData[0]);
      graphGroup.selectAll(".individualData")
                  .attr("transform", function(d){
                    let x = d.x
                    let y = d.y
                    return "translate("+ x +","+ y +")"
                  })
      ;
    }
  //
  })
})
