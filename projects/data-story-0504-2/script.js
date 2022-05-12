let w = 1500;
let h = 800;
let padding = 20;

let viz = d3.select("#container").append("svg")
              .style("width", w)
              .style("height", h)
              .style("background-color", "SlateGrey")
;

let countryName = viz.append("text")
                        .text("Country")
                        .attr("x", 50)
                        .attr("y", h-padding)
                        .attr("font-size", 50)
                        .attr("fill", "white")
;

let testLat = 35.86166;
let testLon = 104.195397;

d3.json("data/countries.geojson").then(function(geoData){
  d3.json("data/cannes-awards.json").then(function(incomingData){
    d3.json("data/location.json").then(function(locationData){
      // console.log(incomingData)

      //sort data by gender
      directorSortedData = sortbyDirector(incomingData);
      // console.log(directorSortedData)

      //draw map
      // console.log(geoData)
      let projection = d3.geoEquirectangular()
                            .fitExtent([[padding, padding], [w-padding, h-padding]], geoData)
      ;
      let pathMaker = d3.geoPath(projection);
      let mapGroup = viz.append("g").attr("class", "mapgroup")
      let map = mapGroup.selectAll(".globe").data(geoData.features).enter()
                      .append("path")
                      .attr("class", "globe")
                      .attr("d", pathMaker)
                      .attr("fill", "black")
                      .style("opacity", "0.5")
                      .attr("stroke", "white")
                      .attr("stroke-width", 1)
      ;

      //draw circles
      let graphgroup = viz.append("g").attr("class", "graphgroup")
      //display data
      let datagroups = graphgroup.selectAll(".datapoint").data(directorSortedData).enter()
                                  .append("g")
                                  .attr("class", "datapoint")
      ;
      datagroups.append("circle")
                  .attr("r", 1)
                  .attr("cx", 0)
                  .attr("cy", 0)
                  .attr("fill", "white")
                  // .attr("stroke", "red")
                  // .attr("stroke-width", 1)
      ;
      // console.log(locationData.country)
      let count = 0;
      //transform each element to the center of that country
      datagroups.attr("transform", function(d, i){
        // console.log(d.director.nationality)
        // console.log(locationData)
        // console.log(d)
        let correspondingDatapoint = locationData.find(function(datapoint){
          if(datapoint.country == d.director.nationality){
            return true
          } else {
            return false
          }
        })
        // console.log(correspondingDatapoint)
        if (correspondingDatapoint.country != "undefined"){
          // console.log(correspondingDatapoint)
          // console.log(d.director);
          let lat = correspondingDatapoint.latitude;
          let lon = correspondingDatapoint.longitude;
          let dotX = projection([lon, lat])[0];
          let dotY = projection([lon, lat])[1];
          d.director.dotX = dotX;
          d.director.dotY = dotY;
          // console.log(d.director);
          return "translate("+dotX+", "+dotY+")"
        }
      })

      //hover effect
      map.filter(d=> d.id != "BMU").on("mouseover", function(event, d){
        d3.select(this).transition().style("opacity", "1");
        // console.log(d)
        countryName.text(d.properties.name)
      })
      map.filter(d=> d.id != "BMU").on("mouseout", function(event, d){
        d3.select(this).transition().style("opacity", "0.5")
        // label.transition().style("opacity", "0")
        countryName.text("Country")
      })

      // console.log(directorSortedData)

      //draw force graph
      directorSortedData = directorSortedData.map(function(datapoint){
        // console.log(datapoint);
        datapoint.x = datapoint.director.dotX;
        datapoint.y = datapoint.director.dotY;
        return datapoint
      })

      let simulation = d3.forceSimulation(directorSortedData)
                          .force("forceX", d3.forceX(function(d){ return d.director.dotX }))
                          .force("forceY", d3.forceY(function(d){ return d.director.dotY }))
                          .force("collide", d3.forceCollide(2))
                          .on("tick", simulationRan)
      ;
      function simulationRan(){
        // console.log(directorSortedData[0])
        viz.selectAll(".datapoint")
            .attr("transform", function(d){
              let x = d.x;
              let y = d.y;
              return "translate(" + x + "," + y + ")"
            })
        ;
      }

    })
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
