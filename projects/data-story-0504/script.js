d3.json("data/cannes-awards.json").then(gotData)

let w = 800;
let h = 500;
let xpadding = 100;
let ypadding = 50;
let padding = 50;

viz = d3.select("#container")
          .append("svg")
          .style("width", w)
          .style("height", h)
          .style("background-color", "lightgrey")
;

function gotData(incomingData) {
  console.log(incomingData);
  genderFilteredData = filterGender(incomingData);
  // console.log(genderFilteredData)
  directorSortedData = sortbyDirector(incomingData);
  console.log(directorSortedData)
  formatYear = d3.timeParse("%Y");
  // console.log(formatYear("2012"))

  // x scale & AXIS
  let xScale = d3.scaleTime().domain([formatYear("2012"), formatYear("2021")]).range([xpadding, w-xpadding]);
  // console.log(xScale(2021))
  let xAxis = d3.axisBottom(xScale);
  let xAxisGroup = viz.append("g")
                        .attr("class", "xaxisgroup")
                        .attr("transform", "translate(0,"+(h-ypadding)+")")
  ;
  xAxisGroup.call(xAxis);

  // y scale & axis
  let yScaleData = genderFilteredData.map(d=>d.sum);
  // console.log(yScaleData);
  let yMin = d3.min(yScaleData);
  let yMax = d3.max(yScaleData);
  // console.log(yExtent);
  let yScale = d3.scaleLinear().domain([0, yMax]).range([h-ypadding, ypadding]);
  let barYScale = d3.scaleLinear().domain([0, yMax]).range([0, h-ypadding*2]);
  // let yAxis = d3.axisLeft(yScale);
  // let yAxisGroup = viz.append("g")
  //                       .attr("class", "yaxisgroup")
  //                       .attr("transform", "translate("+(xpadding)+",0)")
  // ;
  // yAxisGroup.call(yAxis);

//stack data
// let stackedData = d3.stack()
//                       .keys()
// ;

// visualization
// console.log(xAxis.bandwidth())
// let vizGroup = viz.selectAll(".vizGroup").data(genderFilteredData).enter().append("g").attr("class", "vizGroup");
// if (genderFilteredData.)
// for(let i = 0; i < 10; i++){
//   // console.log(genderFilteredData[i])
//   // console.log(genderFilteredData[i].male)
//   vizGroup.append("rect")
//             .attr("x", xScale(formatYear(genderFilteredData[i].year))-10)
//             .attr("y", (h-ypadding-barYScale(genderFilteredData[i].female)))
//             .attr("width", 20)
//             .attr("height", barYScale(genderFilteredData[i].female))
//             .attr("fill", "deeppink")
//   ;
//   vizGroup.append("rect")
//             .attr("x", xScale(formatYear(genderFilteredData[i].year))-10)
//             .attr("y", (h-ypadding-barYScale(genderFilteredData[i].male))-barYScale(genderFilteredData[i].female))
//             .attr("width", 20)
//             .attr("height", barYScale(genderFilteredData[i].male))
//             .attr("fill", "DodgerBlue")
//   ;
// }
let count2012 = 0;
let count2013 = 0;
let count2014 = 0;
let count2015 = 0;
let count2016 = 0;
let count2017 = 0;
let count2018 = 0;
let count2019 = 0;
let count2020 = 0;
let count2021 = 0;
function yPos(d, i) {
  // console.log(i)
  if (d.year == "2012") {
    count2012 += 1;
  } else if (d.year == "2013") {
    count2013 += 1
  } else if(d.year == "2014") {
    count2014 += 1
  } else if(d.year == "2015") {
    count2015 += 1
  } else if(d.year == "2016") {
    count2016 += 1
  } else if(d.year == "2017") {
    count2017 += 1
  } else if(d.year == "2018") {
    count2018 += 1
  } else if(d.year == "2019") {
    count2019 += 1
  } else if(d.year == "2020") {
    count2020 += 1
  } else{
    count2021 += 1
  }
  // console.log(count2012)
  // console.log(count2013)
  if (d.year == "2012") {
    countPos = count2012;
  } else if (d.year == "2013") {
    countPos = count2013;
  } else if(d.year == "2014") {
    countPos = count2014;
  } else if(d.year == "2015") {
    countPos = count2015;
  } else if(d.year == "2016") {
    countPos = count2016;
  } else if(d.year == "2017") {
    countPos = count2017;
  } else if(d.year == "2018") {
    countPos = count2018;
  } else if(d.year == "2019") {
    countPos = count2019;
  } else if(d.year == "2020") {
    countPos = count2020;
  } else if(d.year == "2021"){
    countPos = count2021;
  }
  // console.log(countPos)
  // let yPos = countPos * barYScale(1)
  let yPos = h-padding-countPos * barYScale(1)
  return yPos
}

function textContent(d, i){
  console.log(d.director.director_name)
  return d.director.director_name
}

//datapoint by datapoint
  let vizGroup = viz.selectAll(".vizGroup").data(directorSortedData).enter().append("g").attr("class", "vizGroup");
  let bars = vizGroup.append("rect")
            .attr("x", function(d){
              let xPos = xScale(formatYear(d.year))-10
              return xPos
            })
            .attr("y", yPos)
            .attr("width", 20)
            .attr("height", barYScale(1))
            .attr("fill", function(d){
              if (d.director.gender == "male"){
                return "DodgerBlue"
              } else {
                return "deeppink"
              }
            })
            .attr("stroke-width", 1)
            .attr("stroke", "white")
  ;
  let label = vizGroup.append("text")
                        .text(textContent)
                        .attr("x", function(d){
                          let xPos = xScale(formatYear(d.year))-10
                          return xPos
                        })
                        .attr("y", yPos)
                        .attr("opacity", 0)

  ;
  let caption1 = vizGroup.append("text")
                          .text("movie")
                          .attr("x", 10)
                          .attr("y", 20)
    ;
    let caption2 = vizGroup.append("text")
                            .text("director")
                            .attr("x", 10)
                            .attr("y", 50)
      ;

  //hover effect
  bars.on("mouseover", function(event, d){
    d3.select(this)
              .transition()
              .delay(100)
              .attr("opacity", 0.2)
    ;
    // label.attr("opacity", 1)
    caption1.text(d.movie_name)
    caption2.text(d.director.director_name)
  })
          .on("mouseout", function(event, d){
            d3.select(this)
                      .transition()
                      .delay(100)
                      .attr("opacity", 1)
            ;
          })
          caption1.text("movie")
          caption2.text("director")
}

function filterGender(incomingData){
  let newData = [];
  for(let i = 0; i < 10; i++){
    let maleCount = 0;
    let femaleCount = 0;
    let yearNum = 2012 + i;
    let year = yearNum.toString();
    // console.log(year)
    filteredData = incomingData.filter(d => d.year == year);
    // console.log(filteredData[0].director.length);
    for(let j = 0; j < filteredData.length; j++){
      // console.log(j)
      for(let k = 0; k < filteredData[0].director.length; k++){
        // console.log(k)
        // console.log(filteredData[j].director[k].gender)
        if (filteredData[j].director[k].gender == "male"){
          maleCount += 1
        } else {
          femaleCount += 1
        }
      }
    }
    // console.log("male: "+maleCount, "female: "+femaleCount)
    collectedData = {
      "year": yearNum,
      "male": maleCount,
      "female": femaleCount,
      "sum": femaleCount+maleCount
    };
    // console.log(collectedData)
    newData.push(collectedData);
  }
  return newData;
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
