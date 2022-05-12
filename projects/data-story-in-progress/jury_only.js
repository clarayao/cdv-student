let juryW = d3.select(".jury-only-visualization-wrapper").style("width").split("px").shift();
let juryH = 500;
let juryXpadding = 100;
let juryYpadding = 50;
let juryPadding = 50;
let graphHeight = juryH-juryPadding*2;
// let formatYear = d3.timeParse("%Y");
// let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]

let juryViz = d3.select(".jury-only-visualization-wrapper")
          .append("svg")
          .style("width", juryW)
          .style("height", juryH)
          .style("background-color", "#323232")
;

d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/jury.json").then(function(incomingData){
    // console.log(incomingData);
    let allData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
    allData = d3.merge(allData);
    // console.log(allData);
    jurydisplayData = allData.map(d=>{
      d.year = formatYear(d.year)
      return d;
    })
    console.log(jurydisplayData);
    // console.log(incomingData);
  //
    jurydisplayData = jurydisplayData.map(function(data){
      let correspondingDatapoint = continentData.find(function(things){
          // console.log(data);
          if(things.country == data.nationality){
            return true
          } else {
            return false
          }
        })
      // console.log(correspondingDatapoint);
      // console.log(correspondingDatapoint.continent);
      data.continent = correspondingDatapoint.continent
      return data
    })
  // })
    // console.log(incomingData);
  //
  //
    // x scale & AXIS
    let extent = d3.extent(jurydisplayData, d=>d.year);
    let xScale = d3.scaleTime().domain(extent).range([juryXpadding, juryW-juryXpadding]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = juryViz.append("g")
                          .attr("class", "xaxisgroup")
                          .attr("transform", "translate("+(juryXpadding/2)+","+(juryH-juryYpadding)+")")
    ;
    xAxisGroup.call(xAxis);
  //
    //y scale & axis
    let continentScale = d3.scaleBand().domain(continents).range([juryYpadding, juryH-juryYpadding]);
    // console.log("Europe: " continentScale("Europe"));
    // console.log("Europe: " continentScale("Europe"));
    let continentAxis = d3.axisLeft(continentScale);
    let continentAxisGroup = juryViz.append("g")
                                  .attr("class", "continentaxisgroup")
                                  .attr("transform", "translate("+(juryXpadding)+",0)")
    ;
    continentAxisGroup.call(continentAxis);
    // console.log(continentScale.bandwidth());

    function juryVisualization(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);

      let individualDataGroup = juryViz.selectAll(".juryonlyData").data(data, function(d){ return d.name});
      // update
      individualDataGroup.transition().duration(500)
      // enter
      let enteringElements = individualDataGroup.enter()
                                                .append("g")
                                                .attr("class", "juryonlyData")
      ;

      enteringElements.append("circle")
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

      data = data.map(function(datapoint){
        datapoint.x = xScale(datapoint.year)+intersectionXpadding/2;
        datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
        return datapoint
      })

      // console.log(displayData.length);
      let simulation = d3.forceSimulation(data)
                          .force("forceX", d3.forceX(function(d){
                            return xScale(d.year)+intersectionXpadding/2
                          }))
                          .force("forceY", d3.forceY(function(d){
                            return continentScale(d.continent)+continentScale.bandwidth()/2
                          }))
                          .force("collide", d3.forceCollide(6))
                          .on("tick", simulationRan)
      ;
      function simulationRan(){
        // console.log(incomingData[0]);
        juryViz.selectAll(".juryonlyData")
                            .attr("transform", function(d){
                              // console.log(d);
                              let x = d.x
                              let y = d.y
                              return "translate("+ x +","+ y +")"
                            })
        ;
      }

      let exitingElements = individualDataGroup.exit();
      exitingElements.transition().delay(500).remove();
    }
    // console.log("Here" ,displayData);
    // juryVisualization(displayData);

    document.getElementById("jury-venice-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.venice)
      juryVisualization(incomingData.venice);
    });
    document.getElementById("jury-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.cannes)
      juryVisualization(incomingData.cannes);
    });
    document.getElementById("jury-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.berlin)
      juryVisualization(incomingData.berlin);
    });
    document.getElementById("jury-all-button").addEventListener("click", function() {
      // buttonData(allData)
      console.log(jurydisplayData);
      juryVisualization(jurydisplayData);
    });

  //
  })
})
