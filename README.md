# Home Dashboard
**NOTE: This project is at the moment strictly coupled with my (Simon Egersand, the author) requirements.**
**Therefore should this project not be seen as a generic solution to a bigger problem. It might become a more generic solution later.** 

This dashboard generates current information for the user on a locally run website. The data is fetched from different API:s and presented on a single page.

#### The data that is presented on the dashboard
* SL traffic information
* Weather information

### Example usage (my setup)
* Run a Node.js server on a Raspberry Pi. Display information about the weather and also when your next three metros departure from your nearest station and display it on a monitor. This way I don't have to go for any app to get all the information I need.

#### Features
* ES5 compatible
* Semi-customizable

## TODO
- Make it more customizable
- Create wrapper for APIs
- Handle _all_ status codes
- Implement support for color themes

## TODO BEFORE RELEASE
- Handle configs as should, see TODOS in top of file
- Find nicer way of sending two requests
- Add webkit (and all other) support for all CSS rules
- Make sure it works in all browsers
