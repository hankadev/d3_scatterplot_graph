/* global d3 */
(function() {
  'use strict';

  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
  d3.json(url).then((data) => {
    const w = 900;
    const h = 600;
    const padding = 50;

    for(let i = 0; i < data.length; i++) {
      let temp = data[i].Time.split(':');
      let timeObj = new Date();
      timeObj.setHours(0);
      timeObj.setMinutes(temp[0]);
      timeObj.setSeconds(temp[1]);
      data[i].timeObj = timeObj;
    }

    console.log(data);

    // scale the data for the axes
    const minYear = d3.min(data, (d) => d.Year) - 1;
    const maxYear = d3.max(data, (d) => d.Year) + 1;
    const xScale =
      d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, w - padding]);

    const minTime = d3.min(data, (d) => d.timeObj);
    const maxTime = d3.max(data, (d) => d.timeObj);
    const yScale =
     d3.scaleTime()
       .domain([minTime, maxTime])
       .range([padding, h - padding]);

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

      // add tooltip div
    const tooltip =
      d3.select('#canvas')
        .append('div')
        .attr('id', 'tooltip');

    // add circles to the graph
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (data) => xScale(data.Year))
      .attr('cy',(data) => yScale(data.timeObj))
      .attr('data-xvalue', (data) => data.Year)
      .attr('data-yvalue', (data) => data.timeObj)
      .attr('fill', (data) => {
        return data.Doping === '' ?  '#00e64d' : '#e62e00';
      })
      .attr('r', () => 8)
      .on('mouseover', (data) => {
        tooltip.attr('data-year', data.Year)
          .html(showTooltip(data))
          .style('top',(d3.event.pageY - 30) + 'px')
          .style('left', (d3.event.pageX + 15) + 'px')
          .style('visibility', 'visible');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    function showTooltip(data) {
      let resultString = data.Name + ' (' + data.Nationality + ')';
      resultString += '<br>';
      resultString += 'Time: ' + data.Time;
      resultString += '<br>';
      resultString += 'Year: ' + data.Year;
      if (data.Doping !== '') {
        resultString += '<br>';
        resultString += data.Doping;
      }
      return resultString;
    }

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

    // add legend
    svg.append('text')
      .attr('id', 'legend')
      .attr('x', 850)
      .attr('y', 150)
      .style('text-anchor', 'end')
      .text('Doping Allegations');
    svg.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('x', 770)
      .attr('y', 160)
      .attr('fill', '#e62e00');
    svg.append('text')
      .attr('x', 800)
      .attr('y', 175)
      .attr('id', 'yes')
      .style('text-anchor', 'start')
      .text('Yes');
    svg.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('x', 770)
      .attr('y', 185)
      .attr('fill', '#00e64d');
    svg.append('text')
      .attr('x',800)
      .attr('y', 200)
      .attr('id', 'no')
      .style('text-anchor', 'start')
      .text('No');

  });
}());
