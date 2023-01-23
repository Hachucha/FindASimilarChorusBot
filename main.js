const TelegramApi = require('node-telegram-bot-api')
const { search } = require('./chorus_selection_norhyme')

const token = '5454680334:AAEqIe9TTTGua40oE2FJKfmlw8HuZ_eQzeg'
const bot = new TelegramApi(token)

const errorMsg = (chatId) =>{
    bot.sendMessage(chatId, "Извините, что-то пошло не так.");
}

const responseSearch = async (chatId, text) => {
    let song = search(text);

    let songName;

    if(Object.keys(song).length === 0){
        errorMsg(chatId);
        return;
    }

    if(song.singerAndName == ""){
        songName = song.singer + " - " + song.name;
    }
    else{
        songName = song.singerAndName;
    }

    song.chorus = song.chorus.replaceAll("\n ", "\n");

    bot.sendMessage(chatId, `Максимально подходящая песня из нашей базы: `+songName+".\n\nВот ее припев:\n\n"+song.chorus);
}

const start = async () => {

    if(!bot.isPolling()) {
         await bot.startPolling();
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начать использовать бота.'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                return bot.sendMessage(chatId, `Привет. Этот бот может подобрать известную песню, на мотив припева которой можно напеть ваше стихотоворение.\n\nПримечание: чем короче отрывок стихотворения, тем правдивее совпадение. \n\nНапишите отрывок вашего стихотворения.`);
            }
            responseSearch(chatId, text); 
        } catch (e) {
            return errorMsg(chatId);
        }

    })

    //await bot.stopPolling();
}

start()
