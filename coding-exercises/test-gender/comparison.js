let comW = 1200;
let comH = 1000;
let comXpadding = 40;
let comYpadding = 100;
let comJPadding = 50;
let comSelLXpadding = 150;
let comSelPadding = 0;

let formatYear = d3.timeParse("%Y");
let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]
let juryText = [
  {"text": 'All Juries of the "Big Three" Film Festivals'},
  {"text": 'All Juries of the Venice Film Festival'},
  {"text": 'All Juries of the Cannes Film Festival'},
  {"text": 'All Juries of the Berlin Film Festival'}
];
let text = [
  {"text": 'All Directors Who Won in the "Big Three" Film Festivals'},
  {"text": 'Directors Nominated in the Venice Film Festival'},
  {"text": 'Directors Nominated in the Cannes Film Festival'},
  {"text": 'Directors Nominated in the Berlin Film Festival'}
];
// let graphHeight = juryH-juryPadding*2;
// let formatYear = d3.timeParse("%Y");
// let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]
let comViz = d3.select(".comparison-viz")
          .append("svg")
          .attr("class", "comViz")
          .style("width", comW)
          .style("height", comH)
          .style("background-color", "#323232")
;

let comJuryLabel = comViz.append("g").attr("class", "comJuryLabel");
comJuryLabel.append("text")
        .attr("class", "name")
        .text("Name: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", comH/10)
        .attr("font-size", comW/60+"px")
        // .style("opacity", 0)
;

let cjLabel = comViz.append("g").attr("class", "cjLabel").style("opacity", 0);
cjLabel.append("text")
        .attr("class", "directorName")
        .text("Director: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", comH/10)
        .attr("font-size", comW/60+"px")
;
cjLabel.append("text")
        .attr("class", "movieName")
        .text("Movie: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", comH/7.5)
        .attr("font-size", comW/60+"px")
;
cjLabel.append("image")
        .attr("class", "poster")
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/en/3/34/After_the_Battle_poster.jpg")
        .attr("x", 30)
        .attr("y", comH/7.5)
        .attr("width", 150)
        .attr("height", 250)
;

//y scale & axis
let continentScale = d3.scaleBand().domain(continents).range([comYpadding, comH-comYpadding]);
// console.log("Europe: " continentScale("Europe"));
// console.log("Europe: " continentScale("Europe"));
// console.log(continentScale("Asia"));
let continentAxis = d3.axisLeft(continentScale);
let continentAxisGroup = comViz.append("g")
                              .attr("class", "continentaxisgroup")
                              .attr("transform", "translate("+(comW/2)+",0)")
;
// continentAxisGroup.call(continentAxis);
continentAxisGroup.append("text")
                    .text("Asia")
                    .attr("x", comW/50)
                    .attr("y", continentScale("Asia")+continentScale.bandwidth()/2)
;

//jury graph
d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/jury.json").then(function(incomingData){
    // console.log(incomingData);
    let allJuryData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
    allJuryData = d3.merge(allJuryData);
    // console.log(allData);
    comJdisplayData = allJuryData.map(d=>{
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
    // console.log(continentScale.bandwidth());

    function comJuryCaption(caption){
      // console.log(caption)
      let comJCaption = comViz.append("g").attr("class", "comJCaption");
      comJCaption.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", comW/2)
                .attr("height", comYpadding)
                .attr("fill", "#323232")
      ;
      comJCaption.append("text")
      .attr("id", "intCaption")
      .text(caption.text)
      .attr("x", comW/4)
      .attr("y", comYpadding*6/7)
      .attr("font-size", comW/60+"px")
      .style("text-anchor", "middle")
      .style("font-family", "'Permanent Marker', cursive")
      .attr("fill", "white")
      ;
    }

    function comJuryVisualization(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);
      // let comJury = comViz.append("g").attr("class", "comJuryGroup");
      // comJury.attr("transform", "translate("+(comW/4)+", 0)")
      let comJuryGroup = comViz.selectAll(".comJuryData").data(data, function(d){ return d.name});
      // update
      comJuryGroup.transition().duration(500);
      // enter
      let enteringJuryElements = comJuryGroup.enter()
                                                .append("g")
                                                .attr("class", "comJuryData")
      ;

      enteringJuryElements.append("circle")
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
                            let mousePos = d3.pointer(event, comViz.node())
                            // console.log(mousePos[1]);
                            comJuryLabel.attr("transform", function(){
                              let x = mousePos[0]
                              let y = mousePos[1]-50
                              return "translate("+x+","+y+")"
                            })
                                        .raise()
                            ;
                            comViz.selectAll(".name").text("Name: " + d.name);
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
        datapoint.x = comW/4+comXpadding;
        datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
        return datapoint
      })

      // console.log(displayData.length);
      let simulation = d3.forceSimulation(data)
                          .force("forceX", d3.forceX(function(d){
                            return comW/4+comXpadding
                          }))
                          .force("forceY", d3.forceY(function(d){
                            return continentScale(d.continent)+continentScale.bandwidth()/2
                          }))
                          .force("collide", d3.forceCollide(6))
                          .on("tick", simulationRan)
      ;
      function simulationRan(){
        // console.log(incomingData[0]);
        comViz.selectAll(".comJuryData")
                            .attr("transform", function(d){
                              // console.log(d);
                              let x = d.x
                              let y = d.y
                              return "translate("+ x +","+ y +")"
                            })
        ;
      }

      let exitingElements = comJuryGroup.exit();
      exitingElements.transition().duration(0).remove();
    }
//     // console.log("Here" ,displayData);
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
      // console.log(jurydisplayData);
      comJuryCaption(juryText[0]);
      comJuryVisualization(comJdisplayData);
    });

  //
  })
})

d3.json("data/continent-country.json").then(function(continentData){
  d3.json("data/awards.json").then(function(incomingData){
    // console.log(incomingData);
    let allSelectionData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
    allSelectionData = d3.merge(allSelectionData);
    // console.log(displayData);
    displayData = allSelectionData.map(d=>{
      d.year = formatYear(d.year)
      return d;
    });
    displayData = sortbyDirector(displayData);
    // console.log(displayData);

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

    function comSelCaption(caption){
      console.log(caption)
      let selCaption = comViz.append("g").attr("class", "intCaption");
      selCaption.append("rect")
                .attr("x", comW/2)
                .attr("y", 0)
                .attr("width", comW/2)
                .attr("height", comYpadding)
                .attr("fill", "#323232")
      ;
      selCaption.append("text")
      .attr("id", "intCaption")
      .text(caption.text)
      .attr("x", comW*3/4-comXpadding)
      .attr("y", comYpadding*6/7)
      .attr("font-size", comW/60+"px")
      .style("text-anchor", "middle")
      .style("font-family", "'Permanent Marker', cursive")
      .attr("fill", "white")
      ;
    }
    function comSelVisualization(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);

      let individualDataGroup = comViz.selectAll(".individualData").data(data, function(d){ return d.director.director_name});
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
                            let mousePos = d3.pointer(event, comViz.node())
                            // console.log(mousePos[1]);
                            cjLabel.attr("transform", "translate("+mousePos[0]+","+mousePos[1]+")")
                                  .raise()
                            ;
                            cjLabel.selectAll(".directorName").text("Director: " + d.director.director_name);
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
      enteringElements.transition().delay(500);

      let exitingElements = individualDataGroup.exit();
      exitingElements.transition().duration(0).remove();

      data = data.map(function(datapoint){
        datapoint.x = comW*3/4-comXpadding;
        datapoint.y = continentScale(datapoint.continent)+continentScale.bandwidth()/2;
        return datapoint
      })

      // console.log(displayData.length);
      let simulation = d3.forceSimulation(data)
                          .force("forceX", d3.forceX(function(d){
                            return comW*3/4-comXpadding
                          }))
                          .force("forceY", d3.forceY(function(d){
                            return continentScale(d.continent)+continentScale.bandwidth()/2
                          }))
                          .force("collide", d3.forceCollide(5))
                          .on("tick", simulationRan)
      ;
      function simulationRan(){
        // console.log(incomingData[0]);
        comViz.selectAll(".individualData")
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
    comSelVisualization(displayData);

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
      comSelCaption(juryText[1]);
      comSelVisualization(displayData);
    });
    document.getElementById("jury-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.cannes)
      comSelCaption(text[2]);
      comSelVisualization(displayData);
    });
    document.getElementById("jury-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.berlin)
      comSelCaption(text[3]);
      comSelVisualization(displayData);
    });
    document.getElementById("jury-all-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(allSelectionData)
      comSelCaption(text[0]);
      comSelVisualization(displayData);
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
