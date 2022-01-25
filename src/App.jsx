import {scaleLinear, scaleBand, extent, line} from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import birth from "./birthRate.js"
import { uniq } from "lodash";

function App() {
  const chartSize = 500;
  const margin = 50;
  const legendPadding = 200;

  const _extent = extent(birth.data.births);
  const _scaleY = scaleLinear()
    .domain(_extent)
    .range([chartSize - margin, margin]);
  const _scaleLine = scaleLinear()
    .domain([0, 11])
    .range([margin, chartSize - margin]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const _scaleDate = scaleBand()
    .domain(months)
    .range([0, chartSize - margin - margin]);
  const dataByYear = {};
  birth.data.year.forEach((yr, i) => {
    if (!dataByYear[yr]) {
      dataByYear[yr] = [];
    }
    dataByYear[yr].push(birth.data.births[i]);
  });
  const years = uniq(birth.data.year.slice(0));
  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });

  return (
    <div style={{ margin: 20 }}>
      <h1>Births in US (2013 - 2014)</h1>
      <svg
        width={chartSize + legendPadding}
        height={chartSize}
        // style={{ border: "1px solid pink" }}
      >
        <AxisLeft left={margin} scale={_scaleY} />
        <AxisBottom
          top={chartSize - margin}
          left={margin}
          scale={_scaleDate}
          tickValues={months}
        />
        <text x="-170" y="65" transform="rotate(-90)" fontSize={10}>
          Number of Births
        </text>
        {years.map((year, i) => {
          return (
            <path
              stroke={year === "2013" ? "red" : "blue"}
              strokeWidth={year === 1}
              fill="none"
              key={year}
              d={_lineMaker(dataByYear[year])}
            />
          );
        })}
        {years.map((year, i) => {
          return (
            <text
              fill={year === "2013" ? "red" : "blue"}
              style={{
                fontSize: 15,
                fontWeight: 300,
                fontStyle: "italic"
              }}
              key={`legend--${year}`}
              x={chartSize - margin + 50}
              y={_scaleY(dataByYear[year][10])}
            >
              {year}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
export default App
