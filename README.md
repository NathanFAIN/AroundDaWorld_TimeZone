<h1 align="center" style="margin-top: 0px;">AroundDaWorld TimeZone & Weather</h1>

<p align="center">
  <img src="https://imgur.com/0fZwDjm.png" width="250"/>
</p>

A simple discord bot to follow the time and weather of different cities.

## Table of content

* [Requirements](#requirements)
* [Getting started](#getting-started)
* [Commands](#commands)
* [Authors](#authors)

## Requirements

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Getting started


First, make sure you have all the required tools installed on your local machine then continue with these steps.

**Installation**

```bash
# Clone the repository
git clone https://github.com/NathanFAIN/AroundDaWorld_TimeZone.git

# Enter into the directory
cd AroundDaWorld_TimeZone/

# Install the dependencies
npm install
```
**Configuration**

In `index.js` you have to add your :
- [Discord Bot Token](https://discord.com/developers/applications/) `const token =''`
- [Weather API Key](https://home.openweathermap.org/api_keys/) `const weatherApiKey = ''`
- Channel ID *(right click on the channel -> Copy ID)* `const timezoneChannelId =''`

**Starting the application**

```bash
npm run bot
```

## Commands

> Note: The default prefix is '?'

* **➕ Add time zone** `?timezone add <city>`

* **➖ Remove time zone** `?timezone remove <city>`

<img src="https://imgur.com/tG0TITq.png" width="200">


## Authors

[Nathan FAIN](https://github.com/NathanFAIN/)
[Théo GIMENEZ](https://github.com/TheoGimenez)

