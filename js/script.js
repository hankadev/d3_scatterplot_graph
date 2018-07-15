/* global d3 */
(function() {
  'use strict';

  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
  d3.json(url).then((data) => {
    console.log(data);
    const w = 900;
    const h = 600;
    const padding = 50;

    let date = [];
    let time = [];
    for(let i = 0; i < data.length; i++) {
      date.push(data[i].Year);
      let temp = data[i].Time.split(':');
      let timeObj = new Date();
      timeObj.setHours(0);
      timeObj.setMinutes(temp[0]);
      timeObj.setSeconds(temp[1]);
      time.push(timeObj);
    }

    // scale the data for the axes
    const xScale =
      d3.scaleLinear()
        .domain([d3.min(date) - 1, d3.max(date) + 1])
        .range([padding, w - padding]);

    const yScale =
     d3.scaleTime()
       .domain([d3.max(time) - 10, d3.min(time)])
       .range([h - padding, padding]);

    // create canvas div for svg and tooltip
    d3.select('body')
      .append('div')
      .attr('id', 'canvas')
      .attr('width', w)
      .attr('height', h);
    // create svg element and append it to body
    const svg =
      d3.select('#canvas')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    // add axis to svg canvas
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);
  });
}());
