let intersectionW = d3.select(".inter-visualization-wrapper").style("width").split("px").shift();
let intersectionH = 500;
let intersectionXpadding = 100;
let intersectionYpadding = 50;
let intersectionPadding = 50;
// let graphHeight = intersectionH-intersectionPadding*2;
let intersection_formatYear = d3.timeParse("%Y");
let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]

let viz = d3.select(".intersection-visualization-wrapper")
          .append("svg")
          .style("width", intersectionW)
          .style("height", intersectionH)
          .style("background-color", "#323232")
;

d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/awards.json").then(function(incomingData){
    // console.log(incomingData);
    let allData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
    allData = d3.merge(allData);
    // console.log(displayData);
    displayData = allData.map(d=>{
      d.year = intersection_formatYear(d.year)
      return d;
    });
    displayData = sortbyDirector(displayData);
    console.log(displayData);

    displayData = displayData.map(function(data){
      let correspondingDatapoint = continentData.find(function(things){
          // console.log(data);
          if(things.country == data.director.nationality){
            return true
          } else {
            return false
          }
        })
      // console.log(correspondingDatapoint)
      data.continent = correspondingDatapoint.continent
      return data
    })
    // console.log(incomingData);


    // x scale & AXIS
    let extent = d3.extent(displayData, d=>d.year);
    let xScale = d3.scaleTime().domain(extent).range([intersectionXpadding, intersectionW-intersectionXpadding]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.append("g")
                          .attr("class", "xaxisgroup")
                          .attr("transform", "translate("+(intersectionXpadding/2)+","+(intersectionH-intersectionYpadding)+")")
    ;
    xAxisGroup.call(xAxis);

    //y scale & axis
    let continentScale = d3.scaleBand().domain(continents).range([intersectionYpadding, intersectionH-intersectionYpadding]);
    // console.log("Europe: " continentScale("Europe"));
    // console.log("Europe: " continentScale("Europe"));
    let continentAxis = d3.axisLeft(continentScale);
    let continentAxisGroup = viz.append("g")
                                  .attr("class", "continentaxisgroup")
                                  .attr("transform", "translate("+(intersectionXpadding)+",0)")
    ;
    continentAxisGroup.call(continentAxis);
    // console.log(continentScale.bandwidth());

    function getGroupLocation(d, i){
      let x = xScale(d.year)+intersectionXpadding/2;
      let y = continentScale(d.continent)+continentScale.bandwidth()/2;
      return "translate("+x+", "+y+")"
    }

    function getIncomingGroupLocation(d, i){
      let x = intersectionW + 30;
      let y = continentScale(d.continent)+continentScale.bandwidth()/2;
      return "translate("+x+", "+y+")"
    }

    function getExitingGroupLocation(d, i){
      let x = intersectionW + 30;
      let y = continentScale(d.continent)+continentScale.bandwidth()/2;
    }

    function showAndUpdateGraph(data){
      //continent group
      let graphGroup = viz.append("g").attr("class", "graphgroup");
      console.log(data);

      let individualDataGroup = graphGroup.selectAll(".individualData").data(data, function(d){ return d.director.director_name});
      // update
      individualDataGroup.transition().duration(500)
      // enter
      let enteringElements = individualDataGroup.enter()
                                                .append("g")
                                                .attr("class", "individualData")
      ;

      enteringElements.append("circle")
                          .attr("class", "datapoint")
                          .attr("r", 5)
                          .attr("fill", function(d,i){
                            if (d.director.gender == "male"){
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
        graphGroup.selectAll(".individualData")
                            .attr("transform", function(d){
                              // console.log(d);
                              let x = d.x
                              let y = d.y
                              return "translate("+ x +","+ y +")"
                            })
        ;
      }
      enteringElements.attr("transform", getIncomingGroupLocation).transition().delay(500);

      let exitingElements = individualDataGroup.exit();
      exitingElements.transition().delay(500).attr("transform", getExitingGroupLocation).remove();
    }

    // showAndUpdateGraph(displayData);

    function buttonData(dataSubset){
      displayData = dataSubset;
      displayData = sortbyDirector(displayData);
      displayData = displayData.map(function(data){
        let correspondingDatapoint = continentData.find(function(things){
            if(things.country == data.director.nationality){
              return true
            } else {
              return false
            }
          })
        data.continent = correspondingDatapoint.continent
        return data
      })
      console.log(displayData);
    }

    document.getElementById("selection-venice-button").addEventListener("click", function() {
      // console.log(displayData);
      buttonData(incomingData.venice)
      showAndUpdateGraph(displayData);
    });
    document.getElementById("selection-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      buttonData(incomingData.cannes)
      showAndUpdateGraph(displayData);
    });
    document.getElementById("selection-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      buttonData(incomingData.berlin)
      showAndUpdateGraph(displayData);
    });
    document.getElementById("selection-all-button").addEventListener("click", function() {
      // console.log(displayData);
      buttonData(allData)
      showAndUpdateGraph(displayData);
    });


  })
})


function sortbyDirector(incomingData){
  // console.log(incomingData.length)
  let newData = [];
  for(let k = 0; k<incomingData.length; k++){
    for (let i = 0; i < incomingData[k].director.length; i++){
      let datapoint = {};
      // console.log(d.movie_name)
      datapoint.movie_name = incomingData[k].movie_name;
      datapoint.movie_url = incomingData[k].movie_url;
      datapoint.poster = incomingData[k].poster;
      datapoint.year = incomingData[k].year;
      datapoint.director = incomingData[k].director[i]
      // console.log(datapoint)
      newData.push(datapoint)
      // console.log(d.director[i])
    }
  }
  return newData
}
