# Home Dashboard
**NOTE: This project is at the moment strictly coupled to my (Simon Egersand, the author) requirements.**
**Therefore should this project _not_ be seen as a generic solution to a bigger problem. It will become a more generic solution later.** 

This application fetches real time data from API:s (which I find useful), and then displays them on a single page website. The UI is built for larger screens. The UI is currently in both English and Swedish. A new design of the UI is being worked on.

### The data that is presented on the dashboard
* [SL traffic information](https://www.trafiklab.se/api/sl-realtidsinformation-3)
* [Weather information](https://openweathermap.org/current)

### Example usage (my setup)
* Run a Node.js server on a Raspberry Pi. The application will display information about the weather, when your next three metros departure from your nearest station and time + date. This way I don't have to go for any app to get all the information I need.

![UI](https://cloud.githubusercontent.com/assets/8566054/19629724/0df101bc-997b-11e6-90dd-f017b8bd77e3.png)

## Tech stack
- Node
- Express
- Pug
- Gulp

## TODO
There's a backlog which can be found in the Projects tab.
