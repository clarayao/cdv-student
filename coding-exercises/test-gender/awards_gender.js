d3.json("data/awards.json").then(gotData)

let genderW = d3.select("#container").style("width").split("px").shift();
let genderH = 600;
let xpadding = 100;
let ypadding = 50;
let padding = 50;
let genderGraphHeight = genderH-padding*2;
let formatYear = d3.timeParse("%Y");

let genderViz = d3.select("#container")
          .append("svg")
          .style("width", genderW)
          .style("height", genderH)
          .style("background-color", "lightgrey")
;

//the label for each box
let label = genderViz.append("g").attr("class", "label").style("opacity", 0);
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

  function visualization(data){
    console.log(data.length, data[0])
    //arrange box height
    let maxDirectorsPerYear = d3.max(data, d=>d[1].length)
    console.log(maxDirectorsPerYear)
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
                            let x = xScale(d[0])-15;
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
    console.log(individualDataGroup)
    individualDataGroup.exit().remove();

    let entering = individualDataGroup.enter().append("g").attr("class", "individualData");
    entering.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 30)
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
                  console.log('1')
                  return boxHeight
                })
    ;
    // // console.log(individualDataGroup.enter())
    let merged = individualDataGroup.merge(entering)
    console.log(merged)

    merged                                       .sort((a,b)=>{
      return d3.ascending(a.director.gender, b.director.gender)
    }).transition().attr("transform", function(d, i){
      let x = 0;
      let y = -boxHeight - i * boxHeight;
      return "translate("+x+","+y+")"
    })

    merged.select("rect")
        .transition()
        .attr("height", (d, i)=>{
          console.log('1')
          return boxHeight
        })
    ;

  }
  // genderVisualization(yearGroupedData);



  function buttonData(dataSubset){
    // console.log(incomingData);
    directorSortedData = sortbyDirector(dataSubset);
    yearGroupedData = d3.group(directorSortedData, function(datapoint){
      return datapoint.year;
    })
    // console.log(yearGroupedData);
    return yearGroupedData
  }

  document.getElementById("venice").addEventListener("click", function(){
    data = buttonData(incomingData.venice);
    // console.log(data);
    visualization(data)
  });
  document.getElementById("cannes").addEventListener("click", function(){
    data = buttonData(incomingData.cannes);
    // console.log(data);
    visualization(data)
  });
  document.getElementById("berlin").addEventListener("click", function(){
    data = buttonData(incomingData.berlin);
    // console.log(data);
    visualization(data)
  });
  document.getElementById("all").addEventListener("click", function(){
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
