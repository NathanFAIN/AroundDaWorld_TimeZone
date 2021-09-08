const CronJob = require('cron').CronJob;
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

//Discord Bot (tips here : https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584)
const token = 'ODg1MDgyNzc1ODE5MDE0MTY0.YTh3kQ.a1FjhTxY8sf3ZBaNVkDTeT1ty1E';  //Get your token here : https://discord.com/developers/applications/ {YOUR BOT ID} /bot
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const timezoneChannelId = ''; //Your channel ID (right click on the channel -> Copy ID)

//Weather API
const weatherApiKey = ''; //Get your token here : https://home.openweathermap.org/api_keys/

let citys = [];
let citysArray = [];
let timezoneMessage = null;

class City {
    #isValid = false;
    #weatherIcon = null;
    #message = null;
    #countryInitial = null;
    #temp = null;
    #timeZone = null;
    #name = null;
    #lastWeatherUpdate = null;
    constructor(name) {
        this.#name = name;
        this.#lastWeatherUpdate = null;
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.#name}&appid=${weatherApiKey}&units=metric`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            this.#lastWeatherUpdate = new Date().getTime();
            this.#countryInitial = data['sys']['country'].toLowerCase();
            this.#weatherIcon = data['weather'][0]['icon'];
            this.#temp = data['main']['temp'];
            this.#timeZone = data['timezone'];
            this.#isValid = true;
            console.log('New City : ' + this.#name + ' !');
        }).catch(() => {
            console.log('Please search for a valid city  : ' + this.#name + ' !');
        });
    }

    #updateWeather() {
        let time = new Date().getTime();
        if (this.#lastWeatherUpdate != null && this.#lastWeatherUpdate + 1000 * 60 * 10 < time) {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.#name}&appid=${weatherApiKey}&units=metric`;
            fetch(url)
            .then(response => response.json())
            .then(data => {
                this.#weatherIcon = data['weather'][0]['icon'];
                this.#temp = data['main']['temp'];
            }).catch(() => {
                console.log('Please search for a valid city  : ' + name + ' !');
            });
        } else if (this.#lastWeatherUpdate == null) {
            this.#lastWeatherUpdate = time;
        }
    }

    #iconIdToDiscordEmoji(id) {
        const icons = [
            { id: '01d', emoji: ':sunny:' },
            { id: '01n', emoji: ':full_moon:' },
            { id: '02d', emoji: ':white_sun_small_cloud:' },
            { id: '02n', emoji: ':white_sun_small_cloud:' },
            { id: '03d', emoji: ':white_sun_cloud:' },
            { id: '03n', emoji: ':white_sun_cloud:' },
            { id: '04d', emoji: ':cloud:' },
            { id: '04n', emoji: ':cloud:' },
            { id: '09d', emoji: ':cloud_rain:' },
            { id: '09n', emoji: ':cloud_rain:' },
            { id: '10d', emoji: ':white_sun_rain_cloud:' },
            { id: '10n', emoji: ':white_sun_rain_cloud:' },
            { id: '11d', emoji: ':thunder_cloud_rain:' },
            { id: '11n', emoji: ':thunder_cloud_rain:' },
            { id: '13d', emoji: ':cloud_snow:' },
            { id: '13n', emoji: ':cloud_snow:' },
            { id: '50d', emoji: ':cloud:' },
            { id: '50n', emoji: ':cloud:' },
        ];
        return icons.filter(icon => icon.id == id)[0]['emoji'];
    }

    deleteMessage() {
        this.#message.delete({ timeout: 10000 })
    }
    getTemperature() {
        return this.#temp;
    }

    getName() {
        return this.#name;
    }

    getCountryInitial() {
        return this.#countryInitial;
    }

    getTime() {
        let d = new Date();
        d.setTime( d.getTime() + (this.#timeZone + d.getTimezoneOffset() * 60) * 1000);
        let time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });

        return '**' + time + '** ' + (d.getHours() <= 6 || d.getHours() >= 21 ? ':crescent_moon:' : '  :sunny:');
    }

    getWeather() {
        this.#updateWeather();
        return `**${this.#temp}**°C ` + this.#iconIdToDiscordEmoji(this.#weatherIcon);
    }

    isValid() {
        return this.#isValid;
    }
}

function removeOldMessages() {
    client.channels.cache.find(channel => channel.id === timezoneChannelId).messages.fetch().then(messages => {
        messages.forEach(message => {
            if(message.author.id === client.user.id) {
                message.delete({ timeout: 10000 })
            }
        });
    })
}

function createTimezoneMessage() {
    const messageEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('**TimeZone**')
	.setDescription('\u200B');

    for (const city of citys) {
        if (city.isValid()) {
            messageEmbed.addField(':flag_' + city.getCountryInitial() + ': **' + city.getName() + ' **:', 'Hour : ' + city.getTime() + '\ \ \ \ \ \ Weather : ' + city.getWeather(), false)
        }
    }

    return messageEmbed;
}

function saveCitysArray() {
    citysArray = [];
    for (const city of citys) {
        citysArray.push(city.getName());
    }
    let json_string = JSON.stringify(citysArray);
    fs.writeFile('save.json', json_string, (err) => { 
        if (err) throw err; 
    });
}

function loadCitysArray() {
    citys = [];
    if (fs.existsSync('save.json')) {
        fs.readFile('save.json', function (err, json_string) {
            if (err) throw err;
            try {
                citysArray = JSON.parse(json_string);
                for (const city of citysArray) {
                    citys.push(new City(city));
                }
            } catch {
                console.log('Invalid save.json !');
                fs.unlinkSync('save.json');
            }
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

client.on('messageCreate', function(message){
    let args = message.content.split(' ');

    if ((message.content.startsWith('?timezone add ') || message.content.startsWith('?timezone create ')) && args.length >= 3) {
        let city = capitalizeFirstLetter(args[2]);
        for (let i = 3; i < args.length; i++) {
            city += ' ' + capitalizeFirstLetter(args[i]);
        }
        citys.push(new City(city));
        saveCitysArray();
        const messageEmbed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('**TimeZone**')
            .setDescription('Timezone added : ' + city);
        message.delete({ timeout: 10000 });
        message.channel.send({ embeds: [messageEmbed] }).then(messageBis => {
            setTimeout(function() {
                timezoneMessage.edit({ embeds: [createTimezoneMessage()] });
                messageBis.delete({ timeout: 10000 });
            }, 8000);
        });
    } else if ((message.content.startsWith('?timezone remove ') || message.content.startsWith('?timezone delete ')) && args.length >= 3) {
        let city = capitalizeFirstLetter(args[2]);
        for (let i = 3; i < args.length; i++) {
            city += ' ' + capitalizeFirstLetter(args[i]);
        }
        citys = citys.filter( function(item, idx) {
            return item.getName() != city;
        });
        saveCitysArray();
        const messageEmbed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('**TimeZone**')
            .setDescription('Timezone removed : ' + city);
        message.delete({ timeout: 10000 });
        message.channel.send({ embeds: [messageEmbed] }).then(messageBis => {
            setTimeout(function() {
                timezoneMessage.edit({ embeds: [createTimezoneMessage()] });
                messageBis.delete({ timeout: 10000 });
            }, 8000);
        });
    } else if (message.content.startsWith('?timezone')) {
        const messageEmbed = new MessageEmbed()
            .setColor('#27ae60')
            .setTitle('**TimeZone**')
            .setDescription('Timezone help : ')
            .addField('`?timezone add <city>`', '\u200B', false)
            .addField('`?timezone remove <city>`', '\u200B', false);
        message.delete({ timeout: 10000 });
        message.channel.send({ embeds: [messageEmbed] }).then(messageBis => {
            setTimeout(function() {
                messageBis.delete({ timeout: 10000 });
            }, 8000);
        });
    }
});

client.once('ready', () => {
    removeOldMessages();

    loadCitysArray();

    setTimeout(function() {
        client.channels.cache.find(channel => channel.id === timezoneChannelId).send({ embeds: [createTimezoneMessage()] }).then(message => {
            timezoneMessage = message;
            let scheduleUpdateMessage = new CronJob('2 * * * * *', function() {
                timezoneMessage.edit({ embeds: [createTimezoneMessage()] });
            });
            scheduleUpdateMessage.start();
            process.on('SIGINT', function() {
                message.delete({ timeout: 10000 });
                saveCitysArray();
            });
        });
    }, 8000);
});

client.login(token);
