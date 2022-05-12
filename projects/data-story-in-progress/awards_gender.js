d3.json("data/awards.json").then(gotData)

let genderW = 1000;
let genderH = 600;
let xpadding = 100;
let ypadding = 50;
let padding = 50;
let genderGraphHeight = genderH-padding*2;
let formatYear = d3.timeParse("%Y");

let gender_viz = d3.select(".gender-viz")
          .append("svg")
          .style("width", genderW)
          .style("height", genderH)
          .style("background-color", "#323232")
;

//the label for each box
let label = gender_viz.append("g").attr("class", "label").style("opacity", 0);
label.append("rect")
        .attr("class", "background")
        .attr("x", 0)
        .attr("y", 10)
        .attr("width", 200)
        .attr("height", 300)
        .attr("fill", "#7B7D7D")
;
label.append("text")
        .attr("class", "directorName")
        .text("Director: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", 40)
;
label.append("text")
        .attr("class", "movieName")
        .text("Movie: ")
        .attr("fill", "white")
        .attr("x", 20)
        .attr("y", 65)
;
label.append("image")
        .attr("class", "poster")
        .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/en/3/34/After_the_Battle_poster.jpg")
        .attr("x", 30)
        .attr("y", 60)
        .attr("width", 150)
        .attr("height", 250)
;
// label.selectAll("text").call(cdvTextWrap(3));


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
  let xAxisGroup = gender_viz.append("g")
                        .attr("class", "xaxisgroup")
                        .attr("transform", "translate(0,"+(genderH-ypadding)+")")
  ;
  xAxisGroup.call(xAxis);


  function visualization(data){
    console.log(data)
    //arrange box height
    let maxDirectorsPerYear = d3.max(data, d=>d[1].length)
    let boxHeight = (genderH-padding*2)/maxDirectorsPerYear;
    //gender group
    let yearGroups = gender_viz.selectAll(".yearGroups").data(data, function(d){ return d.movie_name});
    //update
    // yearGroups.transition().duration(500);
    //enter
    let enteringGroups = yearGroups.enter().append("g")
                                    .attr("class", "yearGroups")
    ;

    enteringGroups.attr("transform", function(d, i){
                          // console.log(d[1])
                            let x = xScale(d[0])-15;
                            let y = genderH-ypadding;
                            return "translate("+x+","+y+")"
                          })
    ;

    // let exitingGroups = yearGroups.exit();
    // exitingGroups.transition().delay(500).remove();

    function getIndividualData(d){
      // console.log(d[1]);
      return d[1]
    }

    let individualDataGroup = enteringGroups.selectAll(".individualData").data(getIndividualData).enter()
                                          .append("g")
                                          .sort((a,b)=>{
                                            return d3.ascending(a.director.gender, b.director.gender)
                                          })
                                          .attr("class", "individualData");

    individualDataGroup.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 30)
                .attr("height", boxHeight)
                .attr("fill", function(d,i){
                  if (d.director.gender == "male"){
                    return "DodgerBlue"
                  } else {
                    return "deeppink"
                  }
                })
                .attr("stroke-width", 1)
                .attr("stroke", "white")
                .on("mouseover", function(event, d){
                  // console.log(event)
                  label.transition()
                        .delay(300)
                        .style("opacity", 1)
                  ;
                  let mousePos = d3.pointer(event, gender_viz.node())
                  // console.log(mousePos[1]);
                  label.attr("transform", "translate("+xScale(d.year)+","+mousePos[1]+")")
                        .raise()
                  ;
                  label.selectAll(".directorName").text("Direcotr: " + d.director.director_name);
                  label.selectAll(".movieName").text("Movie: " + d.movie_name);
                  label.selectAll(".poster").attr("xlink:href", d.poster)
                })
                .on("mouseout", function(event, d){
                  label.transition()
                        .delay(300)
                        .style("opacity", 0)
                  ;
                })
    ;
    individualDataGroup.attr("transform", function(d, i){
      let x = 0;
      // let yearLength = getYearLength(d);
      // let height = genderGraphHeight/yearLength;
      let y = -boxHeight - i * boxHeight;
      return "translate("+x+","+y+")"
    })
  }
  // visualization(yearGroupedData)

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
    visualization(data)
  });
  document.getElementById("selection-cannes-button").addEventListener("click", function(){
    data = buttonData(incomingData.cannes);
    // console.log(data);
    visualization(data)
  });
  document.getElementById("selection-berlin-button").addEventListener("click", function(){
    data = buttonData(incomingData.berlin);
    // console.log(data);
    visualization(data)
  });
  document.getElementById("selection-all-button").addEventListener("click", function(){
    data = buttonData(allData);
    // console.log(data);
    visualization(data)
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
