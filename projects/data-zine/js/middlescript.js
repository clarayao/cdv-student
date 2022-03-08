let w = 1200;
let h = 800;

let numColumns = 6;

let viz = d3.select('#container')
              .append("svg")
                .attr("id","viz")
                .attr("width", w)
                .attr("height", h)
                .attr("margin", "20px")
                .style("background-color","black")
;

function gotData(incomingData) {
  console.log(incomingData);

  let datagroups = viz.selectAll(".dataGroup").data(incomingData).enter()
                                                                    .append("g")
                                                                      .attr("class", "datahroup")
  ;

  datagroups.attr("transform", getPosition);

  function getPosition(d, i) {
    let x = 100 + i%numColumns*200;
    let y = 100 + Math.floor(i/numColumns)*200;
    return "translate("+x+", "+y+")"
  }

  //Location
  datagroups.append("circle")
              .attr("x", 0)
              .attr("y", 0)
              .attr("r", 70)
              .attr("fill", "yellow")
  ;

  //triggered by
  datagroups.append("rect")
              .attr("x", -35)
              .attr("y", -60)
              .attr("fill", "red")
              .attr("width", 50)
              .attr("height", 30)
              .attr("transform", "rotate(-40)")
  ;




  // let location = datagroups.append(drawLocations);
  //
  // console.log(drawLocations.);
  // if (drawLocations == "circle") {
    // datagroups.attr("x", 0)
    //           .attr("y", 0)
    //           .attr("r", 70)
    //           .attr("fill", "red")
    // ;
  // } else if (drawLocations == "polygon")

  // if (function() {return d.location} == "Dorm") {
  //   datagroups.attr("x", 0)
  //             .attr("y", 0)
  //             .attr("r", 70)
  //             .attr("fill", "red")
  //   ;
  //   console.log(function() {return d.location});
  // }
  // function drawLocations(d, i) {
  //   if (d.location == "Dorm") {
  //     return "circle"
  //   } else if (d.location == "Academic building") {
  //     return "polygon"
  //   } else if (d.location == "Off-Campus") {
  //     return "rect"
  //   }
  //   // //Locations
  //   // //Dorm
  //   // if (d.location == "Dorm") {
  //   //   let circles = datagroups.append("circle")
  //   //                             .attr("x", 0)
  //   //                             .attr("y", 0)
  //   //                             .attr("r", 70)
  //   //                             .attr("fill", "red")
  //   //   ;
  //   // } else if (d.location == "Academic building") {
  //   //   let triangles = datagroups.append("polygon")
  //   //                               .attr("points", "0,-70 -60,35 60,35")
  //   //                               .attr("fill", "red")
  //   //   ;
  //   // }
  //   // //AB
  // }
}

d3.json("setup/data.json").then(gotData);
