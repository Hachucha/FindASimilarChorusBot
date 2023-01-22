let fs = require('fs');
 

let vovel_letters_big = ['E','Y','U','I','O','A','У','Е','Ы','А','О','Э','Я','И','Ю','Ё'];
let vovel_letters_small = ['e','y','u','i','o','a','у','е','ы','а','о','э','я','и','ю','ё'];

const vovel_pattern = (inp) => {
    var outp = "";
    for(const symb of inp){
        if (vovel_letters_small.includes(symb) 
        || vovel_letters_big.includes(symb) 
        || symb=='\n' ){//|| symb=='\t' || symb==' '
            outp += symb;
        }
        //else console.log(symb);
    };
    return outp;
}

const vovel_pattern_lines = (inp) => {
    return vovel_pattern(inp).split('\n');
}

const search = (input) => {

    //читаем базу треков
    let songs = fs.readFileSync('./songs.json', 'utf8'); 
    songs = JSON.parse(songs);

    var maxRelevantSongRating = 0;//рейтинг - это количество баллов релевантности по моему алгоритму
    var maxRelevantSong = {};
    
    var inputVovPattLines = vovel_pattern_lines(input);//паттерн гласных/слогов четверостишья
    for (const song of songs){
        var songVovPattLines = vovel_pattern_lines(song.chorus);//паттерн гласных/слогов текущей песни
        var currentSongRating = 0; 


        var curRelMassive = []

        //определяем максимальное количество строк, в которое гарантированно укладываются и припев песни и введенное четверостишие
        var lines_max_count;
        if (inputVovPattLines.length>songVovPattLines.length)
            lines_max_count = songVovPattLines.length;
        else
            lines_max_count = inputVovPattLines.length;

        

        //Сравниваем количество слогов в соответствующих строках 
        for (let i=0; i<lines_max_count; i++){
            currentLineRating = Math.sqrt(1  - Math.abs((inputVovPattLines[i].length -songVovPattLines[i].length )/inputVovPattLines[i].length ));

            currentSongRating += currentLineRating;
            curRelMassive.push(currentLineRating);
        }            

        //если новая песня релевантнее прежней, то теперь она самая релевантной
        if (Math.round(currentSongRating * 100)>Math.round(maxRelevantSongRating * 100)){
            maxRelevantSong = song;
            maxRelevantSongRating = currentSongRating;
            song.relMassive = curRelMassive;
            song.songRating = currentSongRating;
        }

        if(song.name == "Ковер-вертолет")
        console.log ("Вертолет currentSongRating = "+ currentSongRating +", curRelMassive = "+curRelMassive+", maxRelevantSongRating = "+maxRelevantSongRating);

    }

    return maxRelevantSong;
}

module.exports = {
    search
}
