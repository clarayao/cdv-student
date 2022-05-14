let comSelW = d3.select(".comparison-selection-viz").style("width").split("px").shift();
let comSelH = window.innerHeight;
let comSelXpadding = 80;
let comSelLXpadding = 150;
let comSelYpadding = 100;
let comSelPadding = 0;
// let graphHeight = comSelH-comSelPadding*2;
let comSel_formatYear = d3.timeParse("%Y");
// let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]

let cjViz = d3.select(".comparison-selection-viz")
          .append("svg")
          .style("width", comSelW)
          .style("height", comSelH)
          .style("background-color", "#323232")
;
let cjLabel = cjViz.append("g").attr("class", "cjLabel").style("opacity", 0);
cjLabel.append("text")
        .attr("class", "directorName")
        .text("Director: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", comSelH/10)
        .attr("font-size", comSelW/60+"px")
;
cjLabel.append("text")
        .attr("class", "movieName")
        .text("Movie: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", comSelH/7.5)
        .attr("font-size", comSelW/60+"px")
;
cjLabel.append("image")
        .attr("class", "poster")
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/en/3/34/After_the_Battle_poster.jpg")
        .attr("x", 30)
        .attr("y", comSelH/7.5)
        .attr("width", 150)
        .attr("height", 250)
;

d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/awards.json").then(function(incomingData){
    // console.log(incomingData);
    let allData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
    allData = d3.merge(allData);
    // console.log(displayData);
    displayData = allData.map(d=>{
      d.year = comSel_formatYear(d.year)
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
    let xScale = d3.scaleTime().domain(extent).range([comSelXpadding+comSelLXpadding, comSelW-comSelXpadding]);
    // let xAxis = d3.axisBottom(xScale);
    // let xAxisGroup = cjViz.append("g")
    //                       .attr("class", "xaxisgroup")
    //                       .attr("transform", "translate(0,"+(comSelH-comSelYpadding)+")")
    // ;
    // xAxisGroup.call(xAxis);
    continentScale = d3.scaleBand().domain(continents).range([comSelYpadding, comSelH-comSelYpadding]);
    let continentAxis = d3.axisLeft(continentScale);
    let continentAxisGroup = cjViz.append("g")
                                  .attr("id", "removetickGroup")
                                  .attr("transform", "translate("+(comSelLXpadding)+",0)")
    ;
    continentAxisGroup.call(continentAxis).call(g => g.select(".domain").remove());

    function getGroupLocation(d, i){
      let x = xScale(d.year);
      let y = continentScale(d.continent)+continentScale.bandwidth()/2;
      return "translate("+x+", "+y+")"
    }

    function getIncomingGroupLocation(d, i){
      let x = comSelW + 30;
      let y = continentScale(d.continent)+continentScale.bandwidth()/2;
      return "translate("+x+", "+y+")"
    }

    function getExitingGroupLocation(d, i){
      let x = comSelW + 30;
      let y = continentScale(d.continent)+continentScale.bandwidth()/2;
    }

    function comSelCaption(caption){
      console.log(caption)
      let selCaption = cjViz.append("g").attr("class", "intCaption");
      selCaption.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", comJuryW)
                .attr("height", 160)
                .attr("fill", "#323232")
      ;
      selCaption.append("text")
      .attr("id", "intCaption")
      .text(caption.text)
      .attr("x", comSelW/2+comSelLXpadding)
      .attr("y", 130)
      .attr("font-size", comJuryW/35+"px")
      .style("text-anchor", "middle")
      .style("font-family", "'Permanent Marker', cursive")
      .attr("fill", "white")
      ;
    }
    function showAndUpdateGraph(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);

      let individualDataGroup = cjViz.selectAll(".individualData").data(data, function(d){ return d.director.director_name});
      // update
      individualDataGroup.transition().duration(500)
      // enter
      let enteringElements = individualDataGroup.enter()
                                                .append("g")
                                                .attr("class", "individualData")
      ;

      enteringElements.append("circle")
                          .attr("class", "datapoint")
                          .attr("r", 4)
                          .attr("fill", function(d,i){
                            if (d.director.gender == "male"){
                              return "DodgerBlue"
                            } else {
                              return "deeppink"
                            }
                          })
                          .on("mouseover", function(event, d){
                            // console.log(event)
                            cjLabel.transition()
                                  .delay(300)
                                  .style("opacity", 1)
                            ;
                            let mousePos = d3.pointer(event, cjViz.node())
                            // console.log(mousePos[1]);
                            cjLabel.attr("transform", "translate("+(xScale(d.year))+","+mousePos[1]+")")
                                  .raise()
                            ;
                            cjLabel.selectAll(".directorName").text("Direcotr: " + d.director.director_name);
                            cjLabel.selectAll(".movieName").text("Movie: " + d.movie_name);
                            cjLabel.selectAll(".poster").attr("xlink:href", d.poster)
                          })
                          .on("mouseout", function(event, d){
                            cjLabel.transition()
                                  .delay(300)
                                  .style("opacity", 0)
                            ;
                          })
                          // .attr("stroke", "black")
                          // .attr("stroke-width", 1)
      ;
      enteringElements.attr("transform", getIncomingGroupLocation).transition().delay(500);

      let exitingElements = individualDataGroup.exit();
      exitingElements.transition().duration(0).attr("transform", getExitingGroupLocation).remove();

      data = data.map(function(datapoint){
        datapoint.x = comSelW/2;
        datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
        return datapoint
      })

      // console.log(displayData.length);
      let simulation = d3.forceSimulation(data)
                          .force("forceX", d3.forceX(function(d){
                            return comSelW/2
                          }))
                          .force("forceY", d3.forceY(function(d){
                            return continentScale(d.continent)+continentScale.bandwidth()/2
                          }))
                          .force("collide", d3.forceCollide(5))
                          .on("tick", simulationRan)
      ;
      function simulationRan(){
        // console.log(incomingData[0]);
        cjViz.selectAll(".individualData")
                            .attr("transform", function(d){
                              // console.log(d);
                              let x = d.x
                              let y = d.y
                              return "translate("+ x +","+ y +")"
                            })
        ;
      }

    }
    comSelCaption(text[0]);
    showAndUpdateGraph(displayData);

    function buttonData(dataSubset){
      intdisplayData = dataSubset;
      intdisplayData = sortbyDirector(intdisplayData);
      intdisplayData = intdisplayData.map(function(data){
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
      // console.log(intdisplayData);
      return intdisplayData
    }

    document.getElementById("jury-venice-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.venice)
      comSelCaption(text[1]);
      showAndUpdateGraph(displayData);
    });
    document.getElementById("jury-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.cannes)
      comSelCaption(text[2]);
      showAndUpdateGraph(displayData);
    });
    document.getElementById("jury-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.berlin)
      comSelCaption(text[3]);
      showAndUpdateGraph(displayData);
    });
    document.getElementById("jury-all-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(allData)
      comSelCaption(text[0]);
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
