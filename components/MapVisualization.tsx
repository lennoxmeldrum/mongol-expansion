import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { EVENTS, CITIES } from '../constants';
import { HistoricalEvent } from '../types';

interface MapVisualizationProps {
  currentYear: number;
  onEventClick: (event: HistoricalEvent) => void;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ currentYear, onEventClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Load GeoJSON once
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
      })
      .catch(err => console.error("Failed to load map data", err));

    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter Active Events
  const activeEvents = useMemo(() => {
    return EVENTS.filter(e => e.year <= currentYear);
  }, [currentYear]);

  // Render Map
  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Projection focused on Eurasia
    const projection = d3.geoMercator()
      .center([85, 45]) // Center on Mongolia/Central Asia
      .scale(dimensions.width / 2.5) // Zoom level
      .translate([dimensions.width / 2, dimensions.height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Draw Countries
    svg.append("g")
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", pathGenerator as any)
      .attr("fill", "#1f2937") // dark gray
      .attr("stroke", "#374151") // lighter gray border
      .attr("stroke-width", 0.5)
      .style("opacity", 0.8);

    // Draw "Empire" Influence (Approximation by coloring conquered cities' regions roughly or just plotting points)
    // For this educational app, we will focus on the Cities and Events to show expansion.

    // Draw Cities
    const cityGroup = svg.append("g");
    
    CITIES.forEach(city => {
      const [lng, lat] = city.coordinates;
      const pos = projection([lng, lat]);
      if (pos) {
        const isConquered = city.conqueredYear <= currentYear;
        
        cityGroup.append("circle")
          .attr("cx", pos[0])
          .attr("cy", pos[1])
          .attr("r", isConquered ? 6 : 3)
          .attr("fill", isConquered ? "#ef4444" : "#9ca3af") // Red if conquered, gray if not
          .attr("stroke", isConquered ? "#7f1d1d" : "none")
          .attr("stroke-width", 2)
          .style("transition", "all 0.5s ease");

        // Label major cities
        if (isConquered || city.name === "Karakorum") {
             cityGroup.append("text")
            .attr("x", pos[0] + 8)
            .attr("y", pos[1] + 4)
            .text(city.name)
            .attr("font-size", "10px")
            .attr("fill", "#e5e7eb")
            .style("opacity", 0.8);
        }
      }
    });

    // Draw Events
    const eventGroup = svg.append("g");
    
    activeEvents.forEach(event => {
      const pos = projection([event.location.lng, event.location.lat]);
      if (pos) {
        // Event Marker
        const marker = eventGroup.append("circle")
          .attr("cx", pos[0])
          .attr("cy", pos[1])
          .attr("r", 8)
          .attr("fill", "#f59e0b") // Amber
          .attr("stroke", "#fff")
          .attr("stroke-width", 1)
          .attr("class", "cursor-pointer hover:r-10 transition-all duration-200")
          .on("click", () => onEventClick(event));
          
        // Pulse animation for the most recent event if it happened this year
        if (event.year === currentYear) {
             marker.append("animate")
            .attr("attributeName", "r")
            .attr("values", "8;15;8")
            .attr("dur", "2s")
            .attr("repeatCount", "indefinite");
            
            marker.append("animate")
            .attr("attributeName", "opacity")
            .attr("values", "1;0.5;1")
            .attr("dur", "2s")
            .attr("repeatCount", "indefinite");
        }
      }
    });

  }, [geoData, dimensions, currentYear, activeEvents, onEventClick]);

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[400px] bg-gray-950 rounded-lg shadow-inner overflow-hidden relative">
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="absolute inset-0" />
        <div className="absolute bottom-4 left-4 text-xs text-gray-400 pointer-events-none">
            Map projection: Mercator (Central Asia focused)
        </div>
    </div>
  );
};

export default MapVisualization;