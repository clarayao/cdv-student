//collected data
let data = [
    {
        "timestamp": "2022-02-15T05:14:29.065Z",
        "Social Networking": 2,
        "Entertainment": 1,
        "Productivity": 0,
        "Reading & Reference": 0,
        "Creativity": 0,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 1,
        "Overall Screen Time": 4
    },
    {
        "timestamp": "2022-02-15T05:26:16.292Z",
        "Social Networking": 2,
        "Entertainment": 2,
        "Productivity": 0,
        "Reading & Reference": 0,
        "Creativity": 0,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 1,
        "Overall Screen Time": 5
    },
    {
        "timestamp": "2022-02-15T05:32:57.097Z",
        "Social Networking": 1,
        "Entertainment": 2,
        "Productivity": 0,
        "Reading & Reference": 0,
        "Creativity": 0,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 1,
        "Overall Screen Time": 4
    },
    {
        "timestamp": "2022-02-15T05:34:19.653Z",
        "Social Networking": 1,
        "Entertainment": 5,
        "Productivity": 0,
        "Reading & Reference": 0,
        "Creativity": 1,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 0,
        "Overall Screen Time": 5
    },
    {
        "timestamp": "2022-02-15T05:38:51.846Z",
        "Social Networking": 3,
        "Entertainment": 4,
        "Productivity": 3,
        "Reading & Reference": 3,
        "Creativity": 2,
        "Health & Fitness": 4,
        "Games": 5,
        "Other": 1,
        "Overall Screen Time": 5
    },
    {
        "timestamp": "2022-02-15T05:41:03.199Z",
        "Social Networking": 3,
        "Entertainment": 5,
        "Productivity": 1,
        "Reading & Reference": 1,
        "Creativity": 1,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 0,
        "Overall Screen Time": 5
    },
    {
        "timestamp": "2022-02-15T05:41:55.546Z",
        "Social Networking": 4,
        "Entertainment": 2,
        "Productivity": 1,
        "Creativity": 0,
        "Education": 1,
        "Health & Fitness": 0,
        "Games": 1,
        "Other": 1,
        "Overall Screen Time": 5
    },
    {
        "timestamp": "2022-02-15T05:46:18.844Z",
        "Social Networking": 2,
        "Entertainment": 2,
        "Productivity": 2,
        "Reading & Reference": 1,
        "Creativity": 0,
        "Education": 1,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 1,
        "Overall Screen Time": 3
    },
    {
        "timestamp": "2022-02-15T06:14:55.461Z",
        "Social Networking": 3,
        "Entertainment": 0,
        "Productivity": 0,
        "Reading & Reference": 0,
        "Creativity": 0,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 0,
        "Overall Screen Time": 3
    },
    {
        "timestamp": "2022-02-15T08:01:06.280Z",
        "Social Networking": 3,
        "Entertainment": 1,
        "Productivity": 1,
        "Reading & Reference": 1,
        "Creativity": 1,
        "Education": 0,
        "Health & Fitness": 0,
        "Games": 0,
        "Other": 1,
        "Overall Screen Time": 5
    }
]

//function to calculate the average data
//and transform the data structure
function averageData(data) {
  let newData = [];
  let keys = Object.keys(data[0]);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let sum = 0;
    let num = 0;
    for (let j = 0; j < data.length; j++) {
      let datum = data[j];
      if (key in datum) {
        sum += datum[key];
        num ++
      }
    }
    let avg = sum/num;
    if (!isNaN(avg)) {
      let newDataPoint = {"name": key, "average": avg, 'numMeasurements': num};
      newData.push(newDataPoint);
    }
  }
  return newData
}

//get the transformed data
let transformedData = averageData(data);
//get the canvas
let container = document.getElementById("container");

//draw the circle for each feature
for (let i = 0; i < transformedData.length; i++) {
  //get the datapoints of each feature
  let datapoint = transformedData[i];
  let category = datapoint.name;
  let avg = datapoint.average;
  //create variables for changing color
  let r = 0;
  let g = 0;
  let b = 0;
  let x = 255/(avg*100);

  //create new circle element
  let circle = document.createElement("div");
  circle.className = "circle";
  //change the size of the circles of each feature
  circle.style.width = (avg * 120) + "px";
  circle.style.height = (avg * 120) + "px";
  //change the color of the circles
  circle.style.backgroundColor = "rgb("+r+x*50+","+g+x*50+","+b+x*50+")";

  //create the tag inside each circle
  let circleName = document.createElement("p");
  circleName.innerHTML = category;
  //change the texts' size and weight according to the data value
  circleName.style.fontSize = (avg * 20) + "px";
  circleName.style.fontWeight = (avg * 200);

  //place the "overall screen time" at the center
    // if (i == transformedData.length-1) {
    //   console.log(i);
    //   circle.style.jestifySelf = center;
    // }

  //add each element into its container
  circle.appendChild(circleName);
  container.appendChild(circle);
}
