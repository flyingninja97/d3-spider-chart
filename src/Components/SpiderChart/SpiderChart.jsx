import React, { useEffect } from 'react';
import * as d3 from 'd3';







/*svg --> 600x600
cx and cy at the center --> 300x300 
range is from 0 to 250 so that there is still space in between circle and svg borders to store text
*/

/* 
1)USE PROPS EVERYWHERE
2)PROVISION FOR CUSTOM STYLING FOR MOBILE AND DESKTOP
3)SPLIT LABELS IN NEXT LINE IF REQUIRED
4)OPTION FOR EXPONENTIAL SCALING 
5)USE EFFECT AND USECALLBACK EVERYWHERE
6)OPTIMIZATIONS REQUIRED
7)TOOLTIP PROP WITH CUSTOMIZATIONS
8) padding and margin customization via props
9)Animate the path
10) Convert to TS
11) Add ids for multiple render on a single page
*/


const concentricCircles = (svg,width,ticks=[2,4,6,8,10])=>{
    const  radialScale = d3.scaleLinear()
    .domain([0,10])
    .range([0,(width/2)-(width/4)]);
    /* mid-point of circle should coincide with midpoint of svg*/
    ticks.forEach(t =>
        svg.append("circle")
        .attr("cx", width/2)
        .attr("cy", width/2)
        .attr("fill", "none")
        .attr("stroke", "#d3d3d3")
        .style("stroke-dasharray", t===ticks[ticks.length-1] ? ("0, 0"):("2, 2"))
        .attr("r", radialScale(t))
    );

    
}
const radians_to_degrees = (radians)=>
{
  var pi = Math.PI;
  return radians * (180/pi);
}

const Axis = (data,svg,width,showTooltipLabel,showTooltipMeta)=>{
    let features = Object.keys(data[0]);
    for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 10,width);
        let label_coordinate = angleToCoordinate(angle, 11,width);
        
        //draw axis line

        let currentAngle = Math.ceil(radians_to_degrees(angle))-90;
        let textAlignment = currentAngle===0||currentAngle===180 ? 'middle': currentAngle>0 && currentAngle<180?'end':'start';
        svg.append("line")
        .attr("x1", width/2)
        .attr("y1", width/2)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","#d3d3d3");
    
        //draw axis label
        svg.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .attr("text-anchor", textAlignment)
        .text(ft_name)
        .attr("fill", "black")
        .attr('id',ft_name.split('')[0])
        .style('text-transform','uppercase')
        .style('cursor','pointer')
        .style("font-size","0.5rem");

        if(showTooltipLabel){
            var tooltip = d3.select("body")
            .append("div")
            .attr('class',"my-tooltip-label")
            .attr("style",
                "position: absolute; visibility: hidden; background-color:#d3d3d3; padding:4px,border-radius:4px;font-size:0.8em")
            
            .text("I'm a tooltip!");

            d3.selectAll(`#${ft_name.split('')[0]}`)
            .on("mouseover", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY+15)+"px").style("left",(event.pageX)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        }
        if(showTooltipMeta){
            var tooltip = d3.select("body")
            .append("div")
            .attr('class',"my-tooltip-meta")
            .attr("style",
                "position: absolute; visibility: hidden; background-color:#d3d3d3; padding:4px,border-radius:4px;font-size:0.8em")
            
            .text("I'm a tooltip!");

            d3.selectAll(`#circle-Politeness`)
            .on("mouseover", function(){return tooltip.style("visibility", "visible");})
            .on("mousemove", function(){return tooltip.style("top", (event.pageY+15)+"px").style("left",(event.pageX)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        }
    }

}
const angleToCoordinate = (angle, value,width)=>{
    const  radialScale = d3.scaleLinear()
.domain([0,10])
.range([0,(width/2)-(width/4)]);
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": (width/2) + x, "y": (width/2) - y};
}

const getPathCoordinates = (data,data_point,offset=0,width)=>{
    let coordinates = [];
    let features = Object.keys(data[0]);
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push({...angleToCoordinate(angle, data_point[ft_name]+offset,width),value:data_point[ft_name],label:ft_name});
    }
    coordinates.push(coordinates[0]);
    return coordinates;
}

const PlotData = (data,svg,width)=>{
    let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

   
for (var i = 0; i < data.length; i ++){
    let d = data[i];
    let coordinates = getPathCoordinates(data,d,0,width);

    //draw the path element
    svg.append("path")
    .datum(coordinates)
    .attr("d",line)
    .attr("stroke-width", 2)
    .attr("stroke", "red")
    .attr("fill", "red")
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.7);
    

    coordinates.forEach((coordinate)=>{
        svg.append("circle")
        .attr('class','small-circles')
        .attr('id',`circle-${coordinate.label}`)
        .attr("cx", coordinate.x)
        .attr("cy", coordinate.y)
        .attr("stroke-width", 2)
        .attr("fill", "white")
        .attr("stroke", "#E2342B")
        .attr("r", 4)
    })

    let metaCoordinates = getPathCoordinates(data,d,1,width);
    metaCoordinates.forEach((coordinate,index)=>{
        svg.append("circle")
        .attr('class','small-circles-meta')
        .attr("cx", coordinate.x)
        .attr("cy", coordinate.y)
        .attr("fill", "#E2342B")
        .attr("stroke", "#E2342B")
        .attr("r", "1%")

        svg.append("text")
        .attr("x", coordinate.x)
        .attr("y", coordinate.y+4)
        .attr("color","white")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .style("font-size", "0.65rem")
        .text(coordinate.value)        
        
    })
}
}


 const SpiderChart = ({data,ticks,width,height,showTooltipLabel,showTooltipMeta})=>{

    console.log(showTooltipLabel);

    useEffect(()=>{
        
        let widthSvg = width?width:document.querySelector('#spider-chart').getBoundingClientRect().width;
        let heightSvg = height?height:widthSvg;
        console.log(widthSvg,heightSvg);
        let svg = d3.selectAll("#spider-chart").append("svg")
        .attr("width", widthSvg)
        .attr("height", heightSvg);
        concentricCircles(svg,widthSvg,ticks);
        Axis(data,svg,widthSvg,showTooltipLabel,showTooltipMeta);
        PlotData(data,svg,widthSvg);

        return (()=>{
            svg.selectAll('*').remove();
        })

    },[data,width,height])

    
    

    return <div id="spider-chart"></div>



   
}

export default SpiderChart;