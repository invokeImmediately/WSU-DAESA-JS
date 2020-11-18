# WSU-DAESA-JS
JavaScript files common to all of the websites of Washington State University's Division of Academic Engagement and Student Achievement in the Office of the Provost. Formerly named WSU-UE---JS.
## Summary
This project contains JavaScript development dependencies for building a JS file containing code designed to be entered into the *Custom JavaScript Editor* page in the themes section of the dashboard of the [Washington State University WordPress platform (WSUWP)](https://github.com/washingtonstateuniversity/WSUWP-spine-parent-theme). These dependencies are organized into separate, modular files that each focus on implementing a specific form of interactivity or dynamism to a website built using WSUWP. Hence, the front-end developer or website coordinator utilizing this project can generally include or exclude each of these files in the final JS build as desired. However, some files will require another JS project to function if they are included in the build.
The code contained in this project was originally written to address the interactivity needs of websites associated Division of Academic Engagement and Student Achievement (DAESA) at WSU. Nevertheless, it has also been designed with applicablity to websites outside of those belonging to DAESA in mind.
## JavaScript Modules Comprising This Project
* **gulpBuilder.js:** Node module created to support the setting up of gulp automation tasks that enable the developer to build CSS and JS files for deployment on websites built using WSUWP.
* **jQuery.animatedCalendar.js:** Script for driving interactive aspects of an academic calendar interface that was designed to display the programmatic events being hosted by an academic unit over the course of a year.
* **jQuery.autoScrollingImages.js:** Used to cause an image to automatically scroll unless the user hovers over or interacts with it, whereupon its motion smoothly comes to a stop. 
* **jQuery.cookieObjs.js:** Script that combines the [jQuery Cookie Plugin v1.4.1](https://github.com/carhartl/jquery-cookie) with code to apply it in implementing page covering notices.
* **jQuery.countdown-custom.js:** Applies the external [The Final Countdown plugin for jQuery](https://github.com/hilios/jQuery.countdown) to create a countdown timer on a website built using WSUWP.
* **jQuery.css-data.js:** Provides a scheme for coupling CSS class names with JavaScript driven behavior.
* **jQuery.cycle2.js:** Repackaged [Cycle2 plugin for jQuery](https://github.com/malsup/cycle2), which has been used on WSUWP to implement carousels, with more options included such as carousel pausing upon user interaction and thumbnail pagers.
## WSU DAESA Websites and Associated Development Projects Utilizing This Project
This project was originally designed to be included as a git submodule in projects dedicated to the development of a website built on the WSUWP platform. For examples of how it is being deployed, one can consult the following GitHub projects for development of websites belonging to the units and programs WSU DAESA.
* **[Academic Success and Career Center (ASCC)](https://ascc.wsu.edu):** [invokeImmediately/ascc.wsu.edu](https://github.com/invokeImmediately/ascc.wsu.edu)
* **[Common Reading program](https://commonreading.wsu.edu):** [invokeImmediately/commonreading.wsu.edu](https://github.com/invokeImmediately/commonreading.wsu.edu)
* **[Distinguished Scholarships program](https://distinguishedscholarships.wsu.edu):** [invokeImmediately/distinguishedscholarships.wsu.edu](https://github.com/invokeImmediately/distinguishedscholarships.wsu.edu)
* **[Division of Academic Engagement and Student Achievement](https://provost.wsu.edu/daesa):** [invokeImmediately/provost.wsu.edu_daesa](https://github.com/invokeImmediately/provost.wsu.edu_daesa)
* **[First-Year Programs](https://firstyear.wsu.edu):** [invokeImmediately/firstyear.wsu.edu](https://github.com/invokeImmediately/firstyear.wsu.edu)
* **[First-Year Focus program](https://learningcommunities.wsu.edu):** [invokeImmediately/learningcommunities.wsu.edu](https://github.com/invokeImmediately/learningcommunities.wsu.edu)
* **[National Student Exchange @ WSU](https://nse.wsu.edu):** [invokeImmediately/nse.wsu.edu](https://github.com/invokeImmediately/nse.wsu.edu)
* **[Office of Undergraduate Research](https://undergraduateresearch.wsu.edu):** [invokeImmediately/undergraduateresearch.wsu.edu](https://github.com/invokeImmediately/undergraduateresearch.wsu.edu)
* **[Phi Beta Kappa, Gamma of Washington Chapter](https://phibetakappa.wsu.edu/):** [invokeImmediately/phibetakappa.wsu.edu](https://github.com/invokeImmediately/phibetakappa.wsu.edu)
* **[Summer Research program](https://summerresearch.wsu.edu):** [invokeImmediately/summerresearch.wsu.edu](https://github.com/invokeImmediately/summerresearch.wsu.edu)
* **[Showcase for Undergraduate Research and Creative Activities (SURCA)](https://surca.wsu.edu):** [invokeImmediately/surca.wsu.edu](https://github.com/invokeImmediately/surca.wsu.edu)
* **[Transfer Clearinghouse](https://transfercredit.wsu.edu):** [invokeImmediately/transfercredit.wsu.edu](https://github.com/invokeImmediately/transfercredit.wsu.edu)
* **[University Common Requirements (UCORE)](https://ucore.wsu.edu):** [invokeImmediately/ucore.wsu.edu](https://github.com/invokeImmediately/ucore.wsu.edu)
* **[UCORE assessment](https://ucore.wsu.edu/assessment):** [invokeImmediately/ucore.wsu.edu-assessment](https://github.com/invokeImmediately/ucore.wsu.edu-assessment)
