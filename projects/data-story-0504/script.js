d3.json("data/cannes-awards.json").then(gotData)

let w = 800;
let h = 500;
let xpadding = 100;
let ypadding = 50;
let padding = 50;
let graphHeight = h-padding*2;
let formatYear = d3.timeParse("%Y");

let viz = d3.select("#container")
          .append("svg")
          .style("width", w)
          .style("height", h)
          .style("background-color", "lightgrey")
;

let label = viz.append("g").attr("class", "label").style("opacity", 0);
label.append("rect")
        .attr("class", "background")
        .attr("x", 10)
        .attr("y", 20)
        .attr("width", 200)
        .attr("height", 300)
        .attr("fill", "white")
;
label.append("text")
        .attr("class", "directorName")
        .text("Director: ")
        .attr("x", 20)
        .attr("y", 40)
;
label.append("text")
        .attr("class", "movieName")
        .text("Movie: ")
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
  console.log(incomingData);
  incomingData = incomingData.map(d=>{
    d.year = formatYear(d.year)
    return d;
  })
  directorSortedData = sortbyDirector(incomingData);
  // console.log(directorSortedData);
  let yearGroupedData = d3.group(directorSortedData, function(datapoint){
    return datapoint.year;
  })

  // x scale & AXIS
  let extent = d3.extent(incomingData, d=>d.year);
  let xScale = d3.scaleTime().domain(extent).range([xpadding, w-xpadding]);
  let xAxis = d3.axisBottom(xScale);
  let xAxisGroup = viz.append("g")
                        .attr("class", "xaxisgroup")
                        .attr("transform", "translate(0,"+(h-ypadding)+")")
  ;
  xAxisGroup.call(xAxis);

  //arrange box height

  //gender group
  let yearGroups = viz.selectAll(".yearGroups").data(yearGroupedData).enter().append("g")
                        .attr("class", "yearGroups")
                        .attr("transform", function(d, i){
                          // console.log(d[1])
                          let x = xScale(d[0])-15;
                          let y = h-ypadding;
                          return "translate("+x+","+y+")"
                        })
  ;

  function getIndividualData(d){
    console.log(d[1]);
    return d[1]
  }

  function getYearLength(d, i){
    if (d.year.getFullYear() == "2012") {
      return 22;
    } else if (d.year.getFullYear() == "2013") {
      return 20;
    } else if(d.year.getFullYear() == "2014") {
      return 19;
    } else if(d.year.getFullYear() == "2015") {
      return 19;
    } else if(d.year.getFullYear() == "2016") {
      return 22;
    } else if(d.year.getFullYear() == "2017") {
      return 19;
    } else if(d.year.getFullYear() == "2018") {
      return 21;
    } else if(d.year.getFullYear() == "2019") {
      return 23;
    } else if(d.year.getFullYear() == "2020") {
      return 14;
    } else{
      return 24;
    }
  }
  function yPos(d, i){
    let yearLength = getYearLength(d);
    let height = graphHeight/yearLength;
    return height
  }

  // let label = d3.select("svg").append("div")
  //                 .attr("class", "label")
  //                 .attr("width", 50)
  //                 .attr("height", 20)
  //                 .attr("x", 10)
  //                 .attr("y", 20)
  //                 // .style("opacity", 0)
  // ;

  let individualDataGroup = yearGroups.selectAll(".individualData").data(getIndividualData).enter()
                                        .append("g")
                                        .sort((a,b)=>{
                                          return d3.ascending(a.director.gender, b.director.gender)
                                        })
                                        .attr("class", "individualData");

  individualDataGroup.append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", 30)
              .attr("height", yPos)
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
                label.transition()
                      .delay(300)
                      .style("opacity", 1)
                ;
                label.attr("transform", "translate("+xScale(d.year)+","+(event.clientY-50)+")")
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
    let yearLength = getYearLength(d);
    let height = graphHeight/yearLength;
    let y = -height - i * height;
    return "translate("+x+","+y+")"
  })

  //hover labels
  // // console.log(d3.select(this.parent))
  // // console.log(d3.select(this))
  // // console.log(d3.select(this.parentNode).attr("transform"))
  // // console.log(xScale(d.year))
  // console.log(d3.pointer(event))
  // label.html("Director: " + d.director.director_name + "<br/>" + "Movie: " + d.movie_name)
  //         .style("width", 300+"px")
  //         .attr("transform", function(d){
  //           // let x = xScale(d.year)
  //           // let y = event.clientY
  //           return "translate(300, 200)"
  //         })

  // let movieCaption = viz.append("svg")
  //                         .attr("class", "label")
  //                         .attr("width", 20)
  //                         .attr("height", 30)
  //                         .attr("x", 10)
  //                         .attr("y", 20)
  //                         .attr("opacity", 0)
  //                         .attr("background-color", "black")
  // ;
  // // movieCaption.append("rect")
  // //               // .attr("x", 10)
  // //               // .attr("y", 20)
  // //               .attr("width", 50)
  // //               .attr("height", 30)
  // //               .attr("fill", "white")
  // // ;
  // // movieCaption.append("text")
  // //               .text("movie")
  // //               // .attr("x", 20)
  // //               // .attr("y", 40)
  // // ;
  // // movieCaption.append("text")
  // //               .text("director")
  // //               // .attr("x", 20)
  // //               // .attr("y", 60)
  // // ;
  // // movieCaption.append("img")
  // //       .attr("xlink:href", "https://en.wikipedia.org//wiki/After_the_Battle_(film)")
  // //       .attr("x", "60")
  // //       .attr("y", "60")
  // //       .attr("width", 60)
  // //       .attr("height", 60)
  // //       .attr("background-color", "black")
  // // ;
  // //hover effect
  // individualDataGroup
  // .on("mouseover", function(event, d){
  //   d3.select(this)
  //       .transition()
  //       .delay(100)
  //       .attr("opacity", 0.4)
  //   ;
  //   movieCaption.attr("opacity", 1)
  //                 .attr("x", xScale(d.year))
  //                 .attr("y", event.clientY)
  // })
  // .on("mouseout", function(event, d){
  //   d3.select(this)
  //       .transition()
  //       .delay(100)
  //       .attr("opacity", 1)
  // ;
  // movieCaption.attr("opacity", 0);
  // })
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
