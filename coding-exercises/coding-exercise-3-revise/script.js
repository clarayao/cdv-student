var w = window.innerWidth;
var h = window.innerHeight;

let viz = d3.select("#viz-container")
                .append("svg")
                  .attr("id", "viz")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("margin", "20px")
;

// function yPos(d, i) {
//   var y = d3.scaleLinear().domain([0,15]).range([h-100, 100]);
//   let newTime = new Date(d.time);
//   console.log(newTime.getUTCHours());
//   let time = newTime.getUTCHours();
//   console.log(y(time));
//   return y(time);
// }
//
// function date(d, i) {
//   let x;
//   let date;
//   let newTime = new Date(d.time);
//   date = newTime.getUTCMonth() + 1 + "/" + (newTime.getUTCDate() + 1);
//   if (d.date == "2022-02-20T16:00:00.000Z") {
//     x = "10%"
//   } else if (d.date == "2022-02-21T16:00:00.000Z") {
//     x = "40%"
//   } else if (d.date == "2022-02-22T16:00:00.000Z") {
//     x = "70%"
//   }
//   return x
// }

function translateGroup(d, i) {
  let x;
  let date;
  let newDate = new Date(d.time);
  date = newDate.getUTCMonth() + 1 + "/" + (newDate.getUTCDate() + 1);
  if (d.date == "2022-02-20T16:00:00.000Z") {
    x = "10%"
  } else if (d.date == "2022-02-21T16:00:00.000Z") {
    x = "40%"
  } else if (d.date == "2022-02-22T16:00:00.000Z") {
    x = "70%"
  }

  var yPos = d3.scaleLinear().domain([0,15]).range([h-100, 100]);
  let newTime = new Date(d.time);
  let time = newTime.getUTCHours();
  let y = yPos(time);

  console.log(x);
  console.log(y);
  return "translate("+20+","+y+")";
}

function trigger(d, i) {
  let color
  if (d.triggeredBy == "Quotes & Readings") {
    color = "Crimson"
  } else if (d.triggeredBy == "Repeated scenarios") {
    color = "DeepPink"
  } else if (d.triggeredBy == "Work") {
    color = "DarkOrange"
  } else if (d.triggeredBy == "Academic") {
    color = "DarkViolet"
  } else if (d.triggeredBy == "Details in lives") {
    color = "LightSeaGreen"
  }
  return color;
}

function topic(d, i) {
  let color
  if (d.aboutWhatTopic == "Art") {
    color = "DarkSlateGray"
  } else if (d.aboutWhatTopic == "Life") {
    color = "Maroon"
  } else if (d.aboutWhatTopic == "Mundane") {
    color = "MediumBlue"
  } else if (d.aboutWhatTopic == "Society") {
    color = "Aquamarine"
  } else if (d.aboutWhatTopic == "Technology") {
    color = "Purple"
  }
  return color;
}

function question(d, i) {
  return d.question;
}


function gotData(incomingData){
  console.log("the incoming data is:" , incomingData)
  let datagroups = viz.selectAll(".dataGroup").data(incomingData).enter().append("g")
                                                          .attr("class", "dataGroup")
  ;

  datagroups.attr("transform", translateGroup);

  datagroups.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 50)
                .attr("fill", trigger)
  ;

  datagroups.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 50)
            .attr("height", 50)
            .attr("fill", topic)
  ;
  datagroups.append("text")
            .text(question)
            .attr("x", 0)
            .attr("y", 0)
            .call(cdvTextWrap(100))
            .attr("fill", "white")
            .style("font-family", "fantasy")
            .style("word-wrap", "initial")
  ;

}

d3.json("data.json").then(gotData);
