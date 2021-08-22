# AroundDaWorld_TimeZone

<p align="center">
  <img src="https://imgur.com/0fZwDjm.png" width="250"/>
</p>

blablablablabla

## Table of content

* [Requirements](#requirements)
* [Getting started](#getting-started)
* [Commands](#common-errors)

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
- Channel ID *(right click on the channel -> Copy ID)* `const timezoneChannelId =''`
- [Weather API Key](https://home.openweathermap.org/api_keys/) `const weatherApiKey = ''`

**Starting the application**

```bash
npm run bot
```

## Commands

* ➕ Add time zone 

`?timezone add <city>`

* ➖ Remove time zone 

`?timezone remove <city>`

<img src="https://imgur.com/tG0TITq.png" width="250">
