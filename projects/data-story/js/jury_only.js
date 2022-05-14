let juryW = d3.select(".jury-only-viz").style("width").split("px").shift();
let juryH = window.innerHeight;
let juryXpadding = 80;
let juryYpadding = 200;
let juryPadding = 50;
let graphHeight = juryH-juryPadding*2;
// let formatYear = d3.timeParse("%Y");
// let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]
let juryText = [
  {"text": 'All Juries of the "Big Three" Film Festivals'},
  {"text": 'All Juries of the Venice Film Festival'},
  {"text": 'All Juries of the Cannes Film Festival'},
  {"text": 'All Juries of the Berlin Film Festival'}
];

let juryViz = d3.select(".jury-only-viz")
          .append("svg")
          .style("width", juryW)
          .style("height", juryH)
          .style("background-color", "#323232")
;
let juryOLabel = juryViz.append("g").attr("class", "juryOLabel");
juryOLabel.append("text")
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

    function juryOnlyCaption(caption){
      console.log(caption)
      let joCaption = juryViz.append("g").attr("class", "intCaption");
      joCaption.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", juryW)
                .attr("height", juryYpadding)
                .attr("fill", "#323232")
      ;
      joCaption.append("text")
      .attr("id", "intCaption")
      .text(caption.text)
      .attr("x", juryW/2)
      .attr("y", juryYpadding*6/7)
      .attr("font-size", juryW/30+"px")
      .style("text-anchor", "middle")
      .style("font-family", "'Permanent Marker', cursive")
      .attr("fill", "white")
      ;
    }

    function juryVisualization(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);

      let individualDataGroup = juryViz.selectAll(".juryonlyData").data(data, function(d){ return d.name});
      // update
      individualDataGroup.transition().duration(500);
      // enter
      let enteringElements = individualDataGroup.enter()
                                                .append("g")
                                                .attr("class", "juryonlyData")
      ;

      enteringElements.append("circle")
                          .attr("class", "datapoint")
                          .attr("r", 7)
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
                            juryOLabel.transition()
                                  .delay(300)
                                  .style("opacity", 1)
                            ;
                            let mousePos = d3.pointer(event, juryViz.node())
                            // console.log(mousePos[1]);
                            juryOLabel.attr("transform", function(){
                              let x = xScale(d.year)
                              let y = mousePos[1]-50
                              return "translate("+x+","+y+")"
                            })
                                        .raise()
                            ;
                            juryOLabel.selectAll(".name").text("Name: " + d.name);
                          })
                          .on("mouseout", function(event, d){
                            d3.select(this).transition().duration(100).attr("opacity", 1)
                            juryOLabel.transition()
                                  .delay(100)
                                  .style("opacity", 0)
                            ;
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
                          .force("collide", d3.forceCollide(8))
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
      exitingElements.transition().duration(0).remove();
    }
    // console.log("Here" ,displayData);
    juryOnlyCaption(juryText[0]);
    juryVisualization(jurydisplayData);

    document.getElementById("jury-venice-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.venice)
      juryOnlyCaption(juryText[1]);
      juryVisualization(incomingData.venice);
    });
    document.getElementById("jury-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.cannes)
      juryOnlyCaption(juryText[2]);
      juryVisualization(incomingData.cannes);
    });
    document.getElementById("jury-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      // buttonData(incomingData.berlin)
      juryOnlyCaption(juryText[3]);
      juryVisualization(incomingData.berlin);
    });
    document.getElementById("jury-all-button").addEventListener("click", function() {
      // buttonData(allData)
      console.log(jurydisplayData);
      juryOnlyCaption(juryText[0]);
      juryVisualization(jurydisplayData);
    });

  //
  })
})
