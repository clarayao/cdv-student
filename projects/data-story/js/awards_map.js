let mapW = d3.select(".map-viz").style("width").split("px").shift();
let mapH = 1200;
let mapPadding = 0;

let mapViz = d3.select(".map-viz").append("svg")
              .style("width", mapW)
              .style("height", mapH)
              .style("background-color", "#323232")
;

let countryName = mapViz.append("text")
                        .text("Country")
                        .attr("x", 5)
                        .attr("y", mapH/6)
                        .attr("font-size", genderW/50+"px")
                        .attr("fill", "white")
                        .style("opacity", 0)
;
let countryCount = mapViz.append("text")
                        .text("Count")
                        .attr("x", 5)
                        .attr("y", mapH/5)
                        .attr("font-size", genderW/50+"px")
                        .attr("fill", "white")
                        .style("opacity", 0)
;

let testLat = 35.86166;
let testLon = 104.195397;

d3.json("data/countries.geojson").then(function(geoData){
  d3.json("data/awards.json").then(function(incomingData){
    d3.json("data/location.json").then(function(locationData){
      // console.log(incomingData)

      let allData = [incomingData.venice, incomingData.cannes, incomingData.berlin];
      allData = d3.merge(allData);

      //sort data by director
      directorSortedData = sortbyDirector(allData);
      // console.log(directorSortedData)

      //draw map
      // console.log(geoData)
      let projection = d3.geoEquirectangular()
                            .fitExtent([[mapPadding, mapPadding], [mapW-mapPadding, mapH-mapPadding]], geoData)
      ;
      let pathMaker = d3.geoPath(projection);
      let mapGroup = mapViz.append("g").attr("class", "mapgroup")
      let map = mapGroup.selectAll(".globe").data(geoData.features).enter()
                      .append("path")
                      .attr("class", "globe")
                      .attr("d", pathMaker)
                      .attr("fill", function(d, i){
                        // console.log(d.id);
                        if (d.id == "BMU") {
                          return "#7B7D7D"
                        } else {
                          return "black"
                        }
                      })
                      .style("opacity", "0.5")
                      .attr("stroke", "white")
                      .attr("stroke-width", 1)
      ;

      function mapCaption(caption){
        // console.log(caption)
        let mCaption = mapViz.append("g").attr("class", "mapCaption");
        mCaption.append("rect")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("width", genderW)
                  .attr("height", 160)
                  .attr("fill", "#323232")
        ;
        mCaption.append("text")
        .attr("id", "mapCaption")
        .text(caption.text)
        .attr("x", mapW/2)
        .attr("y", mapH/10)
        .attr("font-size", genderW/30+"px")
        .style("text-anchor", "middle")
        .style("font-family", "'Permanent Marker', cursive")
        .attr("fill", "white")
        ;
      }



      //draw circles
      function mapVisualization(data){
        // map hover
        let countryCountData = countCountry(data);
        map.on("mouseover", function(event, d){
          d3.select(this).transition().attr("fill", "#e7be3e").style("opacity", "1");
          // console.log(d)
          let mousePos = d3.pointer(event, mapViz.node())
          countryName.text(d.properties.name)
                      .attr("font-family", "'PT Sans Caption', sans-serif")
                      .style("opacity", 1)
                      .attr("transform", function(){
                        let x = mousePos[0]
                        let y = mousePos[1]-130
                        return "translate("+x+","+y+")"
                      })
                      .raise()
          ;
          countryCount.text(function(){
                        // console.log(d.properties.name);
                          if (d.properties.name in countryCountData) {
                            // console.log(d.properties.name);
                            let countryName = d.properties.name
                            return countryCountData[countryName]+" Nominees"
                          } else {
                            return "NONE"
                          }
                        })
                        .attr("font-family", "'PT Sans Caption', sans-serif")
                        .style("opacity", 1)
                        .attr("transform", function(){
                          let x = mousePos[0]
                          let y = mousePos[1]-130
                          return "translate("+x+","+y+")"
                        })
                        .raise()
          ;
        })
        map.on("mouseout", function(event, d){
          d3.select(this).transition().attr("fill", "black").style("opacity", "0.5")
          // label.transition().style("opacity", "0")
          countryName.style("opacity", 0)
          countryCount.style("opacity", 0)
        })

        //visualization
        let graphgroup = mapViz.append("g").attr("class", "graphgroup")
        //display data
        let datagroups = mapViz.selectAll(".datapoint").data(data, function(d){ return d.director.director_name});
        //update
        datagroups.transition().duration(500);
        //enter
        let enteringMap = datagroups.enter()
                                    .append("g")
                                    .attr("class", "datapoint")
        ;
        enteringMap.append("circle")
                    .attr("r", 1)
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("fill", "white")
                    // .attr("stroke", "red")
                    // .attr("stroke-width", 1)
        ;
        // console.log(locationData.country)
        // let count = 0;
        //transform each element to the center of that country
        enteringMap.attr("transform", function(d, i){
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

        //exit
        let exitingMap = datagroups.exit();
        exitingMap.transition().duration(0).remove();

        // console.log(directorSortedData)

        //draw force graph
        data = data.map(function(datapoint){
          // console.log(datapoint);
          datapoint.x = datapoint.director.dotX;
          datapoint.y = datapoint.director.dotY;
          return datapoint
        })

        let simulation = d3.forceSimulation(data)
                            .force("forceX", d3.forceX(function(d){ return d.director.dotX }))
                            .force("forceY", d3.forceY(function(d){ return d.director.dotY }))
                            .force("collide", d3.forceCollide(2))
                            .on("tick", simulationRan)
        ;
        function simulationRan(){
          // console.log(directorSortedData[0])
          mapViz.selectAll(".datapoint")
              .attr("transform", function(d){
                let x = d.x;
                let y = d.y;
                return "translate(" + x + "," + y + ")"
              })
          ;
        }
      }
      mapCaption(text[0]);
      mapVisualization(directorSortedData)

      function mapData(yeardataset){
        let data = sortbyDirector(yeardataset);
        return data
      }

      document.getElementById("selection-venice-button").addEventListener("click", function() {
        // console.log(displayData);
        let displayData = mapData(incomingData.venice)
        mapCaption(text[1]);
        mapVisualization(displayData);
      });
      document.getElementById("selection-cannes-button").addEventListener("click", function() {
        // console.log(displayData);
        let displayData = mapData(incomingData.cannes)
        mapCaption(text[2]);
        mapVisualization(displayData);
      });
      document.getElementById("selection-berlin-button").addEventListener("click", function() {
        // console.log(displayData);
        let displayData = mapData(incomingData.berlin)
        mapCaption(text[3]);
        mapVisualization(displayData);
      });
      document.getElementById("selection-all-button").addEventListener("click", function() {
        // console.log(displayData);
        let displayData = mapData(allData)
        mapCaption(text[0]);
        mapVisualization(displayData);
      });


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

function countCountry(data){
  // console.log(data);
  let newData = [];
  for (let i = 0; i < data.length; i++){
    // console.log(data[i].director.nationality);
    if (data[i].director.nationality in newData) {
      // console.log("NEWDATA", newData);
      // console.log("COUNTRY", data[i].director.nationality);
      let country = data[i].director.nationality
      newData[country] +=1
    } else {
      let country = data[i].director.nationality
      newData[country] = 1
    }
  }
  console.log(newData);
  return newData;
}
