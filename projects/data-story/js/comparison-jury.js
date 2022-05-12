let comJuryW = d3.select(".comparison-jury-viz").style("width").split("px").shift();
let comJuryH = window.innerHeight;
let comJXpadding = 80;
let comJYpadding = 100;
let comJPadding = 50;
// let graphHeight = juryH-juryPadding*2;
// let formatYear = d3.timeParse("%Y");
// let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]

let comJuryViz = d3.select(".comparison-jury-viz")
          .append("svg")
          .style("width", comJuryW)
          .style("height", comJuryH)
          .style("background-color", "#323232")
;
let comJuryLabel = comJuryViz.append("g").attr("class", "comJuryLabel");
comJuryLabel.append("text")
        .attr("class", "name")
        .text("Name: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", juryH/10)
        .attr("font-size", juryW/60+"px")
;

d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/jury.json").then(function(incomingData){
    // console.log(incomingData);
    let allData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
    allData = d3.merge(allData);
    // console.log(allData);
    comJdisplayData = allData.map(d=>{
      d.year = formatYear(d.year)
      return d;
    })
    console.log(comJdisplayData);
    // console.log(incomingData);
  //
    comJdisplayData = comJdisplayData.map(function(data){
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
    let extent = d3.extent(comJdisplayData, d=>d.year);
    let xScale = d3.scaleTime().domain(extent).range([comJXpadding, comJuryW-comJXpadding]);
    // let xAxis = d3.axisBottom(xScale);
    // let xAxisGroup = comJuryViz.append("g")
    //                       .attr("class", "xaxisgroup")
    //                       .attr("transform", "translate("+(comJXpadding/2)+","+(comJuryH-comJYpadding)+")")
    // ;
    // xAxisGroup.call(xAxis);
  //
    //y scale & axis
    let continentScale = d3.scaleBand().domain(continents).range([comJYpadding, comJuryH-comJYpadding]);
    // console.log("Europe: " continentScale("Europe"));
    // console.log("Europe: " continentScale("Europe"));
    let continentAxis = d3.axisLeft(continentScale);
    let continentAxisGroup = comJuryViz.append("g")
                                  .attr("class", "continentaxisgroup")
                                  .attr("transform", "translate("+(comJuryW+600)+",0)")
    ;
    // continentAxisGroup.call(continentAxis);
    // console.log(continentScale.bandwidth());

    function comJuryCaption(caption){
      console.log(caption)
      let comJCaption = comJuryViz.append("g").attr("class", "intCaption");
      comJCaption.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", comJuryW)
                .attr("height", 160)
                .attr("fill", "#323232")
      ;
      comJCaption.append("text")
      .attr("id", "intCaption")
      .text(caption.text)
      .attr("x", comJuryW/2)
      .attr("y", 130)
      .attr("font-size", comJuryW/30+"px")
      .style("text-anchor", "middle")
      .style("font-family", "'Permanent Marker', cursive")
      .attr("fill", "white")
      ;
    }

    function comJuryVisualization(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);

      let individualDataGroup = comJuryViz.selectAll(".comJuryData").data(data, function(d){ return d.name});
      // update
      individualDataGroup.transition().duration(500);
      // enter
      let enteringElements = individualDataGroup.enter()
                                                .append("g")
                                                .attr("class", "comJuryData")
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
                          .on("mouseover", function(event, d){
                            d3.select(this).transition().duration(100).attr("opacity", 0.5)
                            // console.log(event)
                            comJuryLabel.transition()
                                  .delay(300)
                                  .style("opacity", 1)
                            ;
                            let mousePos = d3.pointer(event, comJuryViz.node())
                            // console.log(mousePos[1]);
                            comJuryLabel.attr("transform", function(){
                              let x = xScale(d.year)
                              let y = mousePos[1]-50
                              return "translate("+x+","+y+")"
                            })
                                        .raise()
                            ;
                            comJuryViz.selectAll(".name").text("Name: " + d.name);
                          })
                          .on("mouseout", function(event, d){
                            d3.select(this).transition().duration(100).attr("opacity", 1)
                            comJuryLabel.transition()
                                  .delay(100)
                                  .style("opacity", 0)
                            ;
                          })
                          // .attr("stroke", "black")
                          // .attr("stroke-width", 1)
      ;

      data = data.map(function(datapoint){
        datapoint.x = comJuryW/2+intersectionXpadding;
        datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
        return datapoint
      })

      // console.log(displayData.length);
      let simulation = d3.forceSimulation(data)
                          .force("forceX", d3.forceX(function(d){
                            return comJuryW/2+intersectionXpadding*3
                          }))
                          .force("forceY", d3.forceY(function(d){
                            return continentScale(d.continent)+continentScale.bandwidth()/2
                          }))
                          .force("collide", d3.forceCollide(6))
                          .on("tick", simulationRan)
      ;
      function simulationRan(){
        // console.log(incomingData[0]);
        comJuryViz.selectAll(".comJuryData")
                            .attr("transform", function(d){
                              // console.log(d);
                              let x = d.x
                              let y = d.y
                              return "translate("+ x +","+ y +")"
                            })
        ;
      }

      let exitingElements = individualDataGroup.exit();
      exitingElements.transition().duration(0).remove();
    }
    // console.log("Here" ,displayData);
    comJuryCaption(juryText[0]);
    comJuryVisualization(comJdisplayData);

    document.getElementById("jury-venice-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.venice)
      comJuryCaption(juryText[1]);
      comJuryVisualization(incomingData.venice);
    });
    document.getElementById("jury-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.cannes)
      comJuryCaption(juryText[2]);
      comJuryVisualization(incomingData.cannes);
    });
    document.getElementById("jury-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.berlin)
      comJuryCaption(juryText[3]);
      comJuryVisualization(incomingData.berlin);
    });
    document.getElementById("jury-all-button").addEventListener("click", function() {
      // buttonData(allData)
      console.log(jurydisplayData);
      comJuryCaption(juryText[0]);
      comJuryVisualization(comJdisplayData);
    });

  //
  })
})
