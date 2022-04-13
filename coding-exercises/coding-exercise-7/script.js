d3.json("births.json").then(gotData);

let w = 900;
let h = 500;
let xpadding = 100;
let ypadding = 50;
let viz = d3.select("#container")
              .append("svg")
              .style("width", w)
              .style("height", h)
              .style("outline", "solid black")
;

function gotData(incomingData) {
  incomingData = fixJSDataObjects(incomingData);
  console.log(incomingData.country)

  let flatData = d3.merge(incomingData);

  //xAxis
  let xDomain = d3.extent(flatData, function(d){return d.year});
  let xScale = d3.scaleTime().domain(xDomain).range([xpadding, w-xpadding]);
  let xAxis = d3.axisBottom(xScale);
  let xAxisGroup = viz.append("g")
                        .attr("class", "xaxisgroup")
                        .attr("transform", "translate(0,"+(h-ypadding)+")");
  ;
  xAxisGroup.call(xAxis);

  //yAxis
  let yMax = d3.max(flatData, function(d){return d.birthsPerThousand})
  let yScale = d3.scaleLinear().domain([0, yMax]).range([h-ypadding, ypadding]);
  let yAxis = d3.axisLeft(yScale);
  let yAxisGroup = viz.append("g")
                        .attr("class", "yaxisgroup")
                        .attr("transform", "translate("+(xpadding/2)+", 0)")
  ;
  yAxisGroup.call(yAxis);

  //line drawing function
  let lineMaker = d3.line()
                      .x(function(d, i) {return xScale(d.year)})
                      .y(function(d, i) {return yScale(d.birthsPerThousand)})
  ;

  let graphGroup = viz.append("g").attr("class", "graphGroup");

  function visualization() {
    let dataGroup = graphGroup.selectAll(".line").data(data);

    dataGroup.transition().duration(500);

    dataGroup.enter()
                .append("path")
                .attr("class", "line")
                .attr("d", lineMaker)
                .attr("fill", "none")
                .attr("stroke", function(d, i) {
                  if(d[0].country == "China") {
                    return "red"
                  } else {
                    return "blue"
                  }
                })
                .attr("stroke-width", 3)
    ;
    dataGroup.transition().attr("d", lineMaker).attr("stroke", function(d, i) {
      console.log(d);
      console.log(d[0]);
      if(d[0].country == "China") {
        return "red"
      } else {
        return "blue"
      }
    });

  }

document.getElementById("usa").addEventListener("click", function(){
  data = [incomingData[0]];
  console.log(data);
  console.log(incomingData[0]);
  visualization();
});
document.getElementById("china").addEventListener("click", function(){
  data = [incomingData[1]];
  visualization();
});
}





function fixJSDataObjects(dataToFix) {
  let timeParse = d3.timeParse("%Y");
  return dataToFix.map(function(data){
    return data.map(function(d) {
      return {
        "country": d.country,
        "year": timeParse(d.year),
        "birthsPerThousand": d.birthsPerThousand
      }
    })
  })
}
