function makeResponsive() {
    d3.csv("./assets/data/data.csv").then(function(data) {

        // recieve data from the csv
        console.log(data[0])

        data.forEach(function(data) {
            data.healthcareLow = +data.healthcareLow
            data.poverty = +data.poverty
            data.abbr = data.abbr
        })



        var svgWidth = 960;
        var svgHeight = 500;

        var margin = {
            top: 20,
            right: 40,
            bottom: 80,
            left: 100
        };

        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        var chosenXAxis = "age";
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.healthcareLow),
                d3.max(data, d => d.healthcareLow)
            ])
            .range([0, width]);

        // Create y scale function
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.poverty)])
            .range([height, 0]);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        chartGroup.append("g")
            .call(leftAxis);

        chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.healthcareLow))
            .attr("cy", d => yLinearScale(d.poverty))
            .attr("r", 12)
            .attr("fill", "cornflowerblue")
            .attr("opacity", ".75")
            .attr("stroke", "white")

        chartGroup.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", (d, i) => xLinearScale(d.healthcareLow))
            .attr("y", d => (yLinearScale(d.poverty - 0.15)))
            .classed("stateText", true)
            .text(d => d.abbr)
            .attr("font-size", 10)


        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (margin.left / 1.30))
            .attr("x", 0 - (height / 1.75))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("(%) Low Healthcare)");

        chartGroup.append("text")
            .attr("x", margin.left * 3.3)
            .attr("y", height + 30)
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("(%) Poverty");

        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`<strong>${d.poverty}<strong><hr>${d.healthcareLow}
          medal(s) won`);
            });

        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
                toolTip.show(d, this);
            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(d) {
                toolTip.hide(d);
            });
    }).catch(function(error) {
        console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);