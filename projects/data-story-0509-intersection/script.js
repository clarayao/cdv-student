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
  d3.json("data/cannes-awards.json").then(function(incomingData){
    // console.log(incomingData);
    incomingData = incomingData.map(d=>{
      d.year = formatYear(d.year)
      return d;
    })
    incomingData = sortbyDirector(incomingData);
    // console.log(incomingData);

    incomingData = incomingData.map(function(data){
      let correspondingDatapoint = continentData.find(function(things){
          // console.log(data);
          if(things.country == data.director.nationality){
            return true
          } else {
            return false
          }
        })
      // console.log(correspondingDatapoint.continent)
      data.continent = correspondingDatapoint.continent
      return data
    })
    // console.log(incomingData);


    // x scale & AXIS
    let extent = d3.extent(incomingData, d=>d.year);
    let xScale = d3.scaleTime().domain(extent).range([xpadding, w-xpadding]);
    let xAxis = d3.axisBottom(xScale);
    let xAxisGroup = viz.append("g")
                          .attr("class", "xaxisgroup")
                          .attr("transform", "translate("+(xpadding/2)+","+(h-ypadding)+")")
    ;
    xAxisGroup.call(xAxis);

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
                                                return d3.ascending(a.director.gender, b.director.gender)
                                              })
                                              .attr("class", "individualData")
    ;

    individualDataGroup.append("circle")
                        .attr("class", "datapoint")
                        // .attr("cx", function(d, i){
                        //   let x = xScale(d.year)+xpadding/2
                        //   return x
                        // })
                        // .attr("cy", function(d, i){
                        //   let y = continentScale(d.continent) + continentScale.bandwidth()/2;
                        //   return y
                        // })
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

    incomingData = incomingData.map(function(datapoint){
      datapoint.x = xScale(datapoint.year)+xpadding/2;
      datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
      return datapoint
    })

    console.log(incomingData.length);
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
