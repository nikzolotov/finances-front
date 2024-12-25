import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import "./bar-chart.css";

class BarChart extends React.Component {
  constructor(props) {
    super(props);

    this.data = this.parseData(props.data);
    this.series = this.parseSeries(props.series);
    this.colors = this.parseColors(props.series);

    this.stackedData = d3
      .stack()
      .keys(this.series)(this.data)
      .map((d) => (d.forEach((v) => (v.key = d.key)), d));
  }

  componentDidMount() {
    this.draw();
  }

  draw() {
    const { width, height, margin, marginBrush, duration, title } = this.props,
      svg = this.svg,
      data = this.data,
      series = this.series,
      colors = this.colors,
      stackedData = this.stackedData;

    const formatDate = {
      short: d3.timeFormat("%b"),
      long: d3.timeFormat("%b %y"),
      month: d3.timeFormat("%B"),
      year: d3.timeFormat("%Y"),
    };

    const formatDigits = {
      short: function (d) {
        return (d / 1000).toFixed(0);
      },
    };

    // d3 scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.6);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Total)])
      .range([height - margin.bottom, margin.top]);

    const xBrush = d3
      .scaleBand()
      .domain(x.domain())
      .range([0, width - marginBrush.right - marginBrush.left])
      .padding(0.3);

    const xtBrush = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width - marginBrush.right - marginBrush.left]);

    const yBrush = d3
      .scaleLinear()
      .domain(y.domain())
      .range([height - marginBrush.top - marginBrush.bottom, 0]);

    const color = d3.scaleOrdinal().domain(series).range(colors);

    // Mask for the graph and x-axis
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "cc-graph-mask")
      .append("rect")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.bottom)
      .attr("x", margin.left)
      .attr("y", 0);

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "cc-axis-mask")
      .append("rect")
      .attr("width", width - margin.left - margin.right)
      .attr("height", 40)
      .attr("x", margin.left);

    // svg groups for elements
    const gX = svg
      .append("g")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .attr("clip-path", "url(#cc-axis-mask)");

    const gY = svg
      .append("g")
      .attr("transform", "translate(" + (margin.left - 10) + ",0)");

    const gBrushX = svg
      .append("g")
      .attr("transform", "translate(0," + (height - marginBrush.bottom) + ")");

    const gLine = svg.append("g");
    const gBars = svg.append("g").attr("clip-path", "url(#cc-graph-mask)");

    const gBrush = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + marginBrush.left + "," + marginBrush.top + ")"
      );

    const gMean = svg.append("g");

    // Axes
    const xAxis = (g) =>
      g.call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickSize(0, 0)
          .tickPadding(15)
          .tickFormat((d, i) =>
            d.getMonth() === 0 ? formatDate.long(d) : formatDate.short(d)
          )
          .tickValues(x.domain().filter((d, i) => !(i % 2)))
      );

    const yAxis = (g) =>
      g
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickSize(10, 0)
            .tickPadding(10)
            .tickFormat((d) => `${formatDigits.short(d)}${d !== 0 ? " k" : ""}`)
        )
        .call(function (g) {
          g.selectAll(".tick")
            .filter((d) => d === 0)
            .select("line")
            .remove();
        });

    gX.call(xAxis);
    gY.call(yAxis);

    gBrushX.call(
      d3
        .axisBottom(x)
        .tickSize(0, 0)
        .tickPadding(5)
        .tickFormat((d, i) =>
          d.getMonth() === 0 || i === 0 ? formatDate.year(d) : ""
        )
    );

    // Ground line
    gLine
      .append("line")
      .attr("x1", margin.left - 20)
      .attr("y1", y(0))
      .attr("x2", width - margin.right)
      .attr("y2", y(0))
      .style("stroke", "white")
      .attr("stroke-opacity", 0.1);

    // Bars
    gBars
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => color(d.key))
      .attr("stroke", "#242526")
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.date))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .append("title")
      .text(
        (d) =>
          `${formatDate.month(d.data.date)} ${d.key}: ${Math.abs(
            d.data[d.key]
          ).toLocaleString()}`
      );

    // Bar labels
    gBars
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", (d) => x(d.date) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.Total) - 7)
      .style("font-size", 13)
      .style("fill", "#e9e9e9")
      .attr("text-anchor", "middle")
      .text((d) => formatDigits.short(d.Total));

    // Brushable area with mini graph
    const xBrushStep = xBrush.range()[1] / data.length;

    const brush = d3
      .brushX()
      .handleSize(10)
      .extent([
        [0, 0],
        [
          width - marginBrush.left - marginBrush.right,
          height - marginBrush.top - marginBrush.bottom,
        ],
      ])
      .on("brush", brushing)
      .on("end", brushed);

    gBrush
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => color(d.key))
      .attr("stroke", "#242526")
      .attr("stroke-width", "0.5")
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => xBrush(d.data.date))
      .attr("y", (d) => yBrush(d[1]))
      .attr("height", (d) => yBrush(d[0]) - yBrush(d[1]))
      .attr("width", xBrush.bandwidth());

    gBrush
      .append("g")
      .call(brush)
      .call(brush.move, [
        width - margin.right - margin.left - xBrushStep * 24,
        width - margin.right - margin.left,
      ]);

    gBrush.selectAll(".selection").attr("rx", 4);

    function brushing({ selection }) {
      // Update widths and x of the bars
      const brushScaleF = xBrush.range()[1] / (selection[1] - selection[0]);

      x.range([
        margin.left - selection[0] * brushScaleF,
        width - margin.right + (xBrush.range()[1] - selection[1]) * brushScaleF,
      ]);

      gBars
        .selectAll("rect")
        .attr("x", (d) => x(d.data.date))
        .attr("width", x.bandwidth());

      gBars.selectAll("text").attr("x", (d) => x(d.date) + x.bandwidth() / 2);

      gX.call(xAxis);

      // Highlight selected bars on mini graph
      const fd = filteredDomain(xBrush, ...selection);

      gBrush
        .selectAll(".bar")
        .attr("opacity", (d) => (fd.includes(d.data.date) ? 1 : 0.2));
    }

    function brushed({ selection, sourceEvent }) {
      if (!selection) return;

      // Update heights and y of the bars
      const dateRange = selection.map((d) => xtBrush.invert(d));

      const filteredData = data.filter(
        (d) => d.date >= dateRange[0] && d.date <= dateRange[1]
      );

      y.domain([0, d3.max(filteredData, (d) => d.Total)]);

      gBars
        .selectAll("rect")
        .transition()
        .duration(duration)
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("y", (d) => y(d[1]));

      gBars
        .selectAll("text")
        .transition()
        .duration(duration)
        .attr("y", (d) => y(d.Total) - 7);

      gY.transition().duration(duration).call(yAxis);

      // Calculate mean value
      const meanValue = d3.mean(filteredData, (d) => d.Total);

      // Mean line
      const mean = gMean.selectAll("g").data([meanValue]);

      mean
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${margin.left}, ${y(d)})`)
        .call((g) =>
          g
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width - margin.left - margin.right)
            .attr("y2", 0)
            .attr("stroke", "#FFF")
            .attr("stroke-dasharray", "1 4")
            .attr("opacity", 0.4)
        )
        .call((g) =>
          g
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width - margin.left - margin.right + 5)
            .attr("y", 4)
            .text((d) => formatDigits.short(d) + " k")
        )
        .call((g) => g.append("title").text("Average " + title.toLowerCase()))
        .merge(mean)
        .transition()
        .duration(duration)
        .attr("transform", (d) => `translate(${margin.left}, ${y(d)})`)
        .select("text")
        .delay(duration)
        .text((d) => formatDigits.short(d) + " k");

      // Snapping
      if (!sourceEvent) return;

      const x = selection.map((d) => Math.round(d / xBrushStep) * xBrushStep);

      d3.select(this)
        .transition()
        .call(brush.move, x[1] > x[0] ? x : null);
    }

    function filteredDomain(scale, min, max) {
      let dif = scale(d3.min(scale.domain())) - scale.range()[0],
        iMin = min - dif < 0 ? 0 : Math.round((min - dif) / scale.step()),
        iMax = Math.round((max - dif) / scale.step());

      if (iMax === iMin) --iMin; // It happens with empty selections.

      return scale.domain().slice(iMin, iMax);
    }
  }

  parseData(data) {
    return data.map((d) => ({
      ...d,
      date: new Date(d.date),
    }));
  }

  parseSeries(data) {
    return data.filter((d) => d.parent === null).map((d) => [d.title]);
  }

  parseColors(data) {
    return data.filter((d) => d.parent === null).map((d) => [d.color]);
  }

  render() {
    return (
      <svg
        viewBox={"0 0 " + this.props.width + " " + this.props.height}
        ref={(element) => (this.svg = d3.select(element))}
        style={{ overflow: "visible" }}
      ></svg>
    );
  }
}

BarChart.defaultProps = {
  width: 768,
  height: 490,
  margin: {
    top: 28,
    right: 0,
    bottom: 162,
    left: 70,
  },
  marginBrush: {
    top: 380,
    right: 0,
    bottom: 30,
    left: 70,
  },
  duration: 200,
  title: "",
};

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  marginBrush: PropTypes.object,
  duration: PropTypes.number,
  title: PropTypes.string,
};

export default BarChart;
