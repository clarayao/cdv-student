let intersectionW = d3.select(".intersection-viz").style("width").split("px").shift();
let intersectionH = window.innerHeight;
let intersectionXpadding = 80;
let intersectionYpadding = 200;
let intersectionPadding = 150;
// let graphHeight = intersectionH-intersectionPadding*2;
let intersection_formatYear = d3.timeParse("%Y");
let continents = ["Africa", "Anglo America", "Asia", "Europe", "Latin America", "Oceania"]

let viz = d3.select(".intersection-viz")
          .append("svg")
          .style("width", intersectionW)
          .style("height", intersectionH)
          .style("background-color", "#323232")
;
let intLabel = viz.append("g").attr("class", "intLabel").style("opacity", 0);
intLabel.append("text")
        .attr("class", "directorName")
        .text("Director: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", intersectionH/10)
        .attr("font-size", genderW/60+"px")
;
intLabel.append("text")
        .attr("class", "movieName")
        .text("Movie: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", intersectionH/7.5)
        .attr("font-size", genderW/60+"px")
;
intLabel.append("image")
        .attr("class", "poster")
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/en/3/34/After_the_Battle_poster.jpg")
        .attr("x", 30)
        .attr("y", intersectionH/7.5)
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

    function intersectionCaption(caption){
      console.log(caption)
      let iCaption = viz.append("g").attr("class", "intCaption");
      iCaption.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", intersectionW)
                .attr("height", 160)
                .attr("fill", "#323232")
      ;
      iCaption.append("text")
      .attr("id", "intCaption")
      .text(caption.text)
      .attr("x", intersectionW/2)
      .attr("y", 150)
      .attr("font-size", intersectionW/30+"px")
      .style("text-anchor", "middle")
      .style("font-family", "'Permanent Marker', cursive")
      .attr("fill", "white")
      ;
    }

    // let color = "white";
    function showAndUpdateGraph(data){
      //continent group
      // let graphGroup = viz.append("g").attr("class", "graphgroup");
      // console.log(data);

      let individualDataGroup = viz.selectAll(".individualData").data(data, function(d){ return d.director.director_name});
      // update
      individualDataGroup.transition();
      // enter
      let enteringElements = individualDataGroup.enter()
                                                .append("g")
                                                .attr("class", "individualData")
      ;

      enteringElements.append("circle")
                          .attr("id", "interDatapoint")
                          .attr("r", 5)
                          // .attr("fill", function(d,i){
                          //   if (d.director.gender == "male"){
                          //     return "DodgerBlue"
                          //   } else {
                          //     return "deeppink"
                          //   }
                          // })
                          .attr("fill", "white")
                          .on("mouseover", function(event, d){
                            d3.select(this).transition().duration(100).attr("opacity", 0.5)
                            // console.log(event)
                            intLabel.transition()
                                  .delay(300)
                                  .style("opacity", 1)
                            ;
                            let mousePos = d3.pointer(event, viz.node())
                            // console.log(mousePos[1]);
                            intLabel.attr("transform", "translate("+(xScale(d.year))+","+mousePos[1]+")")
                                  .raise()
                            ;
                            intLabel.selectAll(".directorName").text("Direcotr: " + d.director.director_name);
                            intLabel.selectAll(".movieName").text("Movie: " + d.movie_name);
                            intLabel.selectAll(".poster").attr("xlink:href", d.poster)
                          })
                          .on("mouseout", function(event, d){
                            d3.select(this).transition().duration(100).attr("opacity", 1)
                            intLabel.transition()
                                  .delay(300)
                                  .style("opacity", 0)
                            ;
                          })
                          // .attr("stroke", "black")
                          // .attr("stroke-width", 1)
      ;
      enteringElements.attr("transform", getIncomingGroupLocation).transition().delay(4000);

      let exitingElements = individualDataGroup.exit();
      exitingElements.transition().duration(0).attr("transform", getExitingGroupLocation).remove();

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
        viz.selectAll(".individualData")
                            .attr("transform", function(d){
                              // console.log(d);
                              let x = d.x
                              let y = d.y
                              return "translate("+ x +","+ y +")"
                            })
        ;
      }

    }
    enterView({
      selector: '.itext5',
      enter: function(el) {
        // console.log('a special element entered');
        d3.selectAll("#interDatapoint")
        .transition()
        .duration(500)
        .attr("fill", function(d,i){
          // console.log(d);
          if (d.director.gender == "male"){
            return "DodgerBlue"
          } else {
            return "deeppink"
          }
        })
        // showAndUpdateGraph(displayData);
      },
      exit: function(el) {
        // console.log('a special element exited');
        d3.selectAll("#interDatapoint")
        .transition()
        .attr("fill", "white")
      },
      // progress: function(el, progress) {
      //   console.log("the special element's progress is:", progress);
      // },
      offset: 0.5, // enter at middle of viewport
      // once: true, // trigger just once
    });
    intersectionCaption(text[0]);
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

    document.getElementById("selection-venice-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.venice)
      intersectionCaption(text[1]);
      showAndUpdateGraph(displayData);
    });
    document.getElementById("selection-cannes-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.cannes)
      intersectionCaption(text[2]);
      showAndUpdateGraph(displayData);
    });
    document.getElementById("selection-berlin-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(incomingData.berlin)
      intersectionCaption(text[3]);
      showAndUpdateGraph(displayData);
    });
    document.getElementById("selection-all-button").addEventListener("click", function() {
      // console.log(displayData);
      let displayData = buttonData(allData)
      intersectionCaption(text[0]);
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
