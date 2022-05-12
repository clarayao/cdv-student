d3.json("data/awards.json").then(gotData)

let genderW = d3.select(".gender-viz").style("width").split("px").shift();
let genderH = window.innerHeight;
let xpadding = 150;
let ypadding = 50;
let padding = 150;
let genderGraphHeight = genderH-padding*2;
let formatYear = d3.timeParse("%Y");
let text = [
  {"text": 'All Directors Who Won in the "Big Three" Film Festivals'},
  {"text": 'Directors Nominated in the Venice Film Festival'},
  {"text": 'Directors Nominated in the Cannes Film Festival'},
  {"text": 'Directors Nominated in the Venice Film Festival'}
];

let genderViz = d3.select(".gender-viz")
          .append("svg")
          .style("width", genderW)
          .style("height", genderH)
          .style("background-color", "#323232")
;

//the label for each box
let label = genderViz.append("g").attr("class", "label").style("opacity", 0);
label.append("rect")
        .attr("class", "background")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 200)
        .attr("height", 350)
        .attr("fill", "#7B7D7D")
;
label.append("text")
        .attr("class", "directorName")
        .text("Director: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", 40)
        .attr("font-size", genderW/60+"px")
        // .attr("stroke", "black")
        // .attr("stroke-width", 1.5)
;
label.append("text")
        .attr("class", "movieName")
        .text("Movie: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", 65)
        .attr("font-size", genderW/60+"px")
;
label.append("image")
        .attr("class", "poster")
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/en/3/34/After_the_Battle_poster.jpg")
        .attr("x", 30)
        .attr("y", 70)
        .attr("width", 150)
        .attr("height", 250)
;


function gotData(incomingData) {
  // console.log(incomingData);
  let allData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
  allData = d3.merge(allData);
  // console.log(newData);
  genderdisplayData = allData.map(d=>{
    d.year = formatYear(d.year)
    return d;
  })
  // console.log(displayData);
  directorSortedData = sortbyDirector(genderdisplayData);
  // console.log(directorSortedData);
  // console.log(directorSortedData);
  let yearGroupedData = d3.group(directorSortedData, function(datapoint){
    return datapoint.year;
  })
  // console.log(yearGroupedData);

  // x scale & AXIS
  let extent = d3.extent(genderdisplayData, d=>d.year);
  let xScale = d3.scaleTime().domain(extent).range([xpadding, genderW-xpadding]);
  let xAxis = d3.axisBottom(xScale);
  let xAxisGroup = genderViz.append("g")
                        .attr("class", "xaxisgroup")
                        .attr("transform", "translate(0,"+(genderH-ypadding)+")")
  ;
  xAxisGroup.call(xAxis);

  function genderCaption(caption){
    console.log(caption)
    let gCaption = genderViz.append("g").attr("class", "genderCaption");
    gCaption.append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", genderW)
              .attr("height", 160)
              .attr("fill", "#323232")
    ;
    gCaption.append("text")
    .attr("id", "genderCaption")
    .text(caption.text)
    .attr("x", genderW/2)
    .attr("y", 150)
    .attr("font-size", genderW/30+"px")
    .style("text-anchor", "middle")
    .style("font-family", "'Permanent Marker', cursive")
    .attr("fill", "white")
    ;
  }

  function genderVisualization(data){
    // console.log(data.length, data[0])
    //arrange box height
    let maxDirectorsPerYear = d3.max(data, d=>d[1].length)
    // console.log(maxDirectorsPerYear)
    let boxHeight = (genderH-padding*2)/maxDirectorsPerYear;
    // //gender group
    let yearGroups = genderViz.selectAll(".yearGroups").data(data);
    // //update
    // // yearGroups.transition().duration(500);
    // //enter
    let yearEnter = yearGroups.enter().append("g")
                                    .attr("class", "yearGroups")
                                    .attr("transform", function(d, i){
                          // console.log(d[1])
                            let x = xScale(d[0])-genderW/30;
                            let y = genderH-ypadding;
                            return "translate("+x+","+y+")"
                          });

    yearGroups = yearEnter.merge(yearGroups);



    // // // let exitingGroups = yearGroups.exit();
    // // // exitingGroups.transition().delay(500).remove();

    function getIndividualData(d){
      // console.log(d[1]);
      return d[1]
    }

    // // // let
    let individualDataGroup = yearGroups.selectAll(".individualData").data(getIndividualData, d=>d.movie_name+d.director.director_name);
    // console.log(individualDataGroup)
    individualDataGroup.exit().remove();

    let entering = individualDataGroup.enter().append("g").attr("class", "individualData");
    entering.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", genderW/15)
                .attr("fill", function(d,i){
                  // console.log(d)
                  if (d.director.gender == "male"){
                    return "DodgerBlue"
                  } else {
                    return "deeppink"
                  }
                })
                .attr("stroke-width", 1)
                .attr("stroke", "white")
                .attr("height", (d, i)=>{
                  // console.log('1')
                  return boxHeight
                })
                .on("mouseover", function(event, d){
                  d3.select(this).transition().duration(100).attr("opacity", 0.5)
                  // console.log(event)
                  label.transition()
                        .delay(300)
                        .style("opacity", 1)
                  ;
                  let mousePos = d3.pointer(event, genderViz.node())
                  // console.log(mousePos[1]);
                  label.attr("transform", "translate("+(xScale(d.year)-90)+","+mousePos[1]+")")
                        .raise()
                  ;
                  label.selectAll(".background").attr("width", function(){
                    let directorWidth = d3.select(this.parentNode).select(".directorName").node().getBBox().width;
                    // console.log(directorWidth);
                    let movieWidth = d3.select(this.parentNode).select(".movieName").node().getBBox().width;
                    console.log(this.parentNode);
                    if (directorWidth >= movieWidth) {
                      return directorWidth +10
                    } else {
                      return movieWidth+10
                    }
                    // return 60
                  })
                  label.selectAll(".directorName").text("Direcotr: " + d.director.director_name);
                  label.selectAll(".movieName").text("Movie: " + d.movie_name);
                  label.selectAll(".poster").attr("xlink:href", d.poster)
                })
                .on("mouseout", function(event, d){
                  d3.select(this).transition().duration(100).attr("opacity", 1)
                  label.transition()
                        .delay(300)
                        .style("opacity", 0)
                  ;
                })
    ;
    // // console.log(individualDataGroup.enter())
    let merged = individualDataGroup.merge(entering)
    // console.log(merged)

    merged.sort((a,b)=>{
      return d3.ascending(a.director.gender, b.director.gender)
    })
          .transition()
          .duration(500)
          .attr("transform", function(d, i){
            let x = 0;
            let y = -boxHeight - i * boxHeight;
            return "translate("+x+","+y+")"
          })
    ;

    merged.select("rect")
        .transition()
        .duration(0)
        .attr("height", (d, i)=>{
          // console.log('1')
          return boxHeight
        })
    ;

  }
  genderCaption(text[0]);
  genderVisualization(yearGroupedData);
// 'Directors Nominated in the "Big Three" Film Festivals', 'Directors Nominated in the Venice Film Festival', 'Directors Nominated in the Cannes Film Festival', 'Directors Nominated in the Belin Film Festival'


  function buttonData(dataSubset){
    // console.log(incomingData);
    directorSortedData = sortbyDirector(dataSubset);
    yearGroupedData = d3.group(directorSortedData, function(datapoint){
      return datapoint.year;
    })
    // console.log(yearGroupedData);
    return yearGroupedData
  }

  document.getElementById("selection-venice-button").addEventListener("click", function(){
    data = buttonData(incomingData.venice);
    // console.log(data);
    genderCaption(text[1]);
    genderVisualization(data, 'Directors Nominated in the Venice Film Festival')
  });
  document.getElementById("selection-cannes-button").addEventListener("click", function(){
    data = buttonData(incomingData.cannes);
    // console.log(data);
    genderCaption(text[2]);
    genderVisualization(data, 'Directors Nominated in the Cannes Film Festival')
  });
  document.getElementById("selection-berlin-button").addEventListener("click", function(){
    data = buttonData(incomingData.berlin);
    // console.log(data);
    genderCaption(text[3]);
    genderVisualization(data, 'Directors Nominated in the Belin Film Festival')
  });
  document.getElementById("selection-all-button").addEventListener("click", function(){
    data = buttonData(allData);
    // console.log(data);
    genderCaption(text[0]);
    genderVisualization(data, 'Directors Nominated in the "Big Three" Film Festivals')
  });
}



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
