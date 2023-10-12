

# Dockasaurus RX 🦖
Docker container diagnostics at your fingertips.

<p align="center"> <img src="https://raw.githubusercontent.com/oslabs-beta/Dockasaurus-RX/dev/screenshots/Dockasaurus.png" alt="Dockasaurus RX Logo" width=300 height=300></p>

Dockasaurus RX diagnoses resource consumption and prescribes optimization to empower users to make informed resource allocation decisions.






## Table of Contents 📖

- [About](#about-💡)
- [Core Features](#core-features-⭐️)
- [Under the hood](#under-the-hood-🩻) 
- [Installation](#installation-💿)
- [Development Roadmap](#development-roadmap🚧)
- [Contributing](#contributing-➕)
- [Contact](#contact-📧)
- [Creators](#creators-👥)






## About 💡

A nimble and easy-to-use DevOps container tool, Dockasaurus RX has a major trick up its sleeve beyond mere monitoring and visualization. It's more than a pulse check. To keep your applications happy and healthy, Dockasaurus RX retains important vitals of all your containers for 7 days allowing comparisons to be drawn regarding the well-being of concurrent container workloads over a designated period.






## Core Features ⭐️

        **INSERT MAIN DEMO GIF HERE**

The extension is divided into a minimal yet feature-rich 3 panel dashboard, designed to be uncluttered, collapsible, and viewport adaptive to your DevOps needs.

- 📉 **Chart Visualizations** sit atop the dashboard displaying current CPU utilization and Memory Usage Percent in 2 Grafana iframes.

<img src="https://raw.githubusercontent.com/oslabs-beta/Dockasaurus-RX/bc/screenshots/GraphComponent.gif" alt="Graph Gif">

- 🗃️ The lower section of DRX's dashboard is shared by 2 panels. The left section houses interactive **Container Cards** that allow for dynamic searches, filtering, and selection where containers can be run, stopped, viewed, or pruned.

        **INSERT SEARCH AND FILTERING DEMO GIF HERE**

- 👑 The crown jewel of DRX is **Optimization**. Suggestions are prescribed in the bottom right panel. Once a container is selected, DRX automatically assesses the health of the containerized application and suggests 3 levels of optimization displayed in the accordion along with a comparative analysis of historical data.

        **INSERT ACCORDION DEMO GIF HERE**

<p align="right">(<a href="#readme-top">return to top</a>)</p>






## Under the hood 🩻

The Dockasaurus RX Docker Desktop extension is a frontend **React** application built with the MUI Component Library and leverages the following additonal technologies to benefit users:
-  **Node.js**
-  **Prometheus** establishes a robust data pipeline for gathering and storing Docker Engine metrics, ensuring accuracy and space efficiency. DRX's Optimization Suggestions rule-based algorithms are written with data scraped by Prometheus.
-  **Grafana** seamlessly extracts and visualizes Docker container metrics to provide the frontend with interactive charts and graphs for comprehensive container performance monitoring.

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)

<p align="right">(<a href="#readme-top">return to top</a>)</p>






## Installation 💿

<p align="right">(<a href="#readme-top">return to top</a>)</p>






## Development Roadmap 🚧

- [X] Add 'At A Glance' Comparison to Optimization Panel
- [X] Add CPU usage Grafana Visualization
- [X] Add Optimization Algorithm
- [ ] Add Unit Testing
- [ ] Add CPU Usage Alerts
- [ ] Add Snapshot CRUD Functionality
- [ ] Add Optimization Chart to Optimizaton Panel
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

<p align="right">(<a href="#readme-top">return to top</a>)</p>






## Contributing ➕
Dockasaurus RX is our pride and joy and we'd love to see the open source community collaborate and participate in its growth. We invite you to share your ideas. Please reach out below.

Contributions can also be made by simply **Forking** DRX. From your fork:

1. Create a Feature Branch (git checkout -b feature/Idea)
2. Commit your Changes (git commit -m 'A message detailing your idea')
3. Push to the Branch (git push origin feature/Idea)
4. Open a Pull Request to be reviewed

<p align="right">(<a href="#readme-top">return to top</a>)</p>






## Contact 📧

- **Email:** [dockasaurusrx@gmail.com](mailto:dockasaurusrx@gmail.com)
- **GitHub:** [https://github.com/oslabs-beta/Dockasaurus-RX](https://github.com/oslabs-beta/Dockasaurus-RX)

<p align="right">(<a href="#readme-top">return to top</a>)</p>






## Creators 👥

<table style="width:100%;">
   <tr>
    <td style="width:200px">
    <p align="center">
      <img src="https://github.com/Choebryan.png" style="width:6rem; border:1px solid red" /><br>
      <strong>Bryan Choe</strong><br>
      <a href="https://github.com/Choebryan">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/bryan-choe/">LinkedIn</a>
    </p>
    </td>
    <td style="width:200px">
      <p align="center">
      <img src="https://github.com/jchu47.png" style="width:6rem;" /><br/>
      <strong>Justin Chu</strong><br/>
      <a href="https://github.com/jchu47">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/justin-chu-10a70a205/">LinkedIn</a>
      </p>
    </td>
    <td style="width:200px">
      <p align="center">
      <img src="https://github.com/zampare.png" style="width:6rem;" /><br/>
      <strong>Nate Doucette</strong><br/>
      <a href="https://github.com/zampare">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/nate-doucette-473a04141/">LinkedIn</a>
      </p>
    </td>
    <td style="width:200px">
      <p align="center">
      <img src="https://github.com/hommesweethomme.png" style="width:6rem;" /><br/>
      <strong>Christian Robinson</strong><br/>
      <a href="https://github.com/hommesweethomme">GitHub</a><br/>
      <a href="https://www.linkedin.com/in/christian-daniel-robinson/">LinkedIn</a>
      </p>
    </td>
  </tr>
</table>

<p align="right">(<a href="#readme-top">return to top</a>)</p>
