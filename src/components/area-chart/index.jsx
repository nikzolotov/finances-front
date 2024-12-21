import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

class AreaChart extends React.Component {
  constructor(props) {
    super(props);

    this.series = props.series.map((item) => item.id);
    this.colors = props.series.map((item) => item.color);

    this.data = this.parseData(props.data, props.currencies, props.currency);
    this.stackedData = d3.stack().keys(this.series)(this.data);

    // Vars for update method
    this.y = undefined;
    this.gAreas = undefined;
    this.areaGenerator = undefined;
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currency !== prevProps.currency) {
      this.update();
    }
  }

  draw() {
    const { width, height, margin } = this.props,
      svg = this.svg;

    // d3 scales
    const x = d3
      .scaleTime()
      .domain([this.data[0].date, this.data[this.data.length - 1].date])
      .range([margin.left, width - margin.right]);

    this.y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(this.stackedData[this.stackedData.length - 1], (d) => d[1]),
      ])
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal().domain(this.series).range(this.colors);

    // svg groups for elements
    const gX = svg
      .append("g")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")");

    this.gAreas = svg.append("g");

    // Axes
    // const xAxis = (g) =>
    //   g.call(
    //     d3
    //       .axisBottom(x)
    //       .tickSize(0, 0)
    //       .tickPadding(10)
    //       .tickFormat((d) => d3.timeFormat("%b %Y")(d))
    //       .tickValues([x.domain()[0], x.domain()[1]])
    //   );

    // gX.call(xAxis)
    //   .selectAll("text")
    //   .style("text-anchor", (d, i) => (i === 0 ? "start" : "end"));

    // assets areas
    this.areaGenerator = d3
      .area()
      .x((d) => x(d.data.date))
      .y0((d) => this.y(d[0]))
      .y1((d) => this.y(d[1]))
      .curve(d3.curveBasis);

    this.gAreas
      .selectAll("path")
      .data(this.stackedData)
      .join("path")
      .attr("d", this.areaGenerator)
      .attr("fill", (d) => color(d.key));
  }

  update() {
    // Redraw graph with new currency
    this.data = this.parseData(
      this.props.data,
      this.props.currencies,
      this.props.currency
    );
    this.stackedData = d3.stack().keys(this.series)(this.data);

    this.y.domain([
      0,
      d3.max(this.stackedData[this.stackedData.length - 1], (d) => d[1]),
    ]);

    this.gAreas
      .selectAll("path")
      .data(this.stackedData)
      .join("path")
      .transition()
      .duration(200)
      .attr("d", this.areaGenerator);
  }

  parseData(data, currencies, currency) {
    return data.map(function (d) {
      let rate = 1;
      if (currency !== undefined && currency !== "rub") {
        rate = currencies.filter((dd) => dd.date === d.date)[0][currency];
      }

      return {
        date: new Date(d.date),
        estate: +d.estate / rate,
        stocks: +d.stocks / rate,
        cash: +d.cash / rate,
      };
    });
  }

  render() {
    return (
      <svg
        // width="100%"
        // height="100%"
        viewBox={"0 0 " + this.props.width + " " + this.props.height}
        ref={(element) => (this.svg = d3.select(element))}
        style={{ display: "block", overflow: "visible" }}
      ></svg>
    );
  }
}

AreaChart.defaultProps = {
  width: 300,
  height: 100,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  duration: 200,
};

AreaChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  duration: PropTypes.number,
};

export default AreaChart;
