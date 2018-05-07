d3.select(window).on("resize",makeresponsive);

makeresponsive();

function makeresponsive()
{
    var svgarea = d3.select("body").select("svg");
    if (!svgarea.empty()) 
    {
        svgarea.remove();    
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    margin ={
        top:50,bottom:100,right:50,left:70
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width =  svgWidth - margin.left - margin.right;

    // append svg element

    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("height",svgHeight)
        .attr("width", svgWidth)

    // append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`);
        //.attr("transform",`translate(${margin.top},${margin.bottom})`);
    
    // read csv
    d3.csv("data.csv", function(err,driveData){

        driveData.forEach(function (data) {
            data.SampleSize = +data.SampleSize;
            data.DroveAlone = +data.DroveAlone;
            
        });

    //create scales

        var xLinearScale  = d3.scaleLinear()
            .domain([250000,d3.max(driveData, d =>d.DroveAlone)])
            .range([1  ,width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0,d3.max(driveData, d =>d.SampleSize)])
            .range([height,1]);
            
    

    //create axes

        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale);

    //append axes 

        chartGroup.append("g")
            //.attr("fill","blue")
            .attr("transform",`translate(0,${height})`)
            .attr("class","axisX")
            .call(xAxis)
        chartGroup.append("g")
           // .attr("transform", `translate(${width})`)
            .attr("class","axisY")
            .call(yAxis);

        
       
        
    //line generator 
    /*    var lineGroup = chartGroup.selectAll("line")
            .append("path")
            .data(driveData)
            .enter()
            .append("line")
            .attr("x",d=> xLinearScale(d.DroveAlone))
            .attr("y", d=> yLinearScale(d.SampleSize))
            .attr("fill","none")
            .attr("stroke","red")
        //var line = d3.line()
            //.x(d=> xLinearScale(d.DroveAlone))
            //.y(d=> yLinearScale(d.SampleSize));

    //append line

       // chartGroup.append("path")
         //   .data([driveData])
           // .attr("d",line)
           // .attr("fill","none")
            //.attr("stroke","red") */
        
        var circleGroup = chartGroup.selectAll("circle")
            .data(driveData)
            .enter()
            .append("circle")
            .attr("cx", d=> xLinearScale(d.DroveAlone))
            .attr("cy", d=> yLinearScale(d.SampleSize))
            .attr("r", "10")
            .attr("fill", "pink")
            .attr("stroke-width", "1")
            .attr("stroke", "brown")


        // Step 1: Append tooltip div
        var toolTip = d3.select("body")
            .append("div")
            .style("display", "none")
            .classed("tooltip", true)

  // Step 2: Create "mouseover" event listener to display tooltip
        circleGroup.on("mouseover", function (d) {
             toolTip.style("display", "block")
                .html(
                  `<strong>${d.SampleSize}\n${d.DroveAlone}<strong><hr>${d.Geography}`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
         })
    // Step 3: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function () {
            toolTip.style("display", "none")
         });


         //create axis labels 

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("fill","blue")
            .text("SampleSize");
        
        chartGroup.append("text")
            .attr("transform", `translate(${width/2}, ${height + margin.top + 10})`)
            .attr("class", "axisText")
            .attr("fill","blue")
            .text("DroveAlone");
    
    
    });
};
