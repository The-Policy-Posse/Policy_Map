# Capitol Compass: U.S. States and Congressional Districts Visualization

## Overview

Capitol Compass is an interactive web-based tool for exploring the political geography of the United States. Using a responsive map interface, users can explore state and congressional district details, such as representatives, network legislation, and idealogy scores.

## Features

* **Interactive Map**: Navigate between national, state, and district views with zoom functionality.
* **State and District Insights**: View representatives, party affiliation, and network details.
* **Real-Time Tooltips**: Quick hover-based information for states and districts.


## Getting Started

### Prerequisites

Ensure you have the following installed:

* Anaconda or Miniconda.
* A modern web browser (e.g., Chrome, Firefox, Edge).

### Setting up the Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/The-Policy-Posse/Policy_Map.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Policy_Map
   ```
3. Create and activate the Conda environment using the provided environment.yml file:
   ```bash
   conda env create -f environment.yml (environment_windows.yml for windows)
   conda activate policy-map
   ```


## How to Use

1. Open the interactive map.
2. Click on a state to zoom in and view detailed state information.
3. Navigate between tabs in the sidebar for general, network, or ideology data.
4. Zoom further into congressional districts to explore district-specific details.



###### Dan notes 11/25 11:51 EST

- Launch Conda Prompt
- Create environment with .yml for OS of choice
- Activate policy-map environment
- Run python -m http.server 8000 in conda 
- Navigate to http://localhost:8000/congress_map.html in browser for the map and chart
- Navigate to http://localhost:8000/radarChartLaunch.html for just the Radar Chart