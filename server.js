const express = require("express");
const app = express();

let TicTacToe = require("./TicTacToe.js");

const TelegramBot = require("node-telegram-bot-api");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const botToken = process.env.BOT_TOKEN;

const bot = new TelegramBot(botToken,{polling:true});

var gameObjList = [];

bot.onText(/\/quit/g,(msg,match)=>{
    const chatId = msg.chat.id;
    for (let i = 0;i<gameObjList.length;i++) {
        if (msg.from.id==gameObjList[i].id) {
            gameObjList.splice(i,1);
            bot.sendMessage(chatId,"*Thanks for your interest in my Tic Tac Toe game!*\n Github Project Link: https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe  Game!\n Link to Github Project - https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe \n Type /start again to start a new game!",{
                parse_mode:"Markdown"
            });
        }
    }
});

bot.onText(/\/start/g,(msg,match)=>{
    const chatId = msg.chat.id;
    //var ticTacToe = new TicTacToe(chatId,bot);
    if (gameObjList.length!=0) {
        for (let i = 0;i<gameObjList.length;i++) {
            if (gameObjList[i].id!=msg.from.id) {
                gameObjList.push(new TicTacToe(msg.from.id,msg.from.is_bot,msg.from.first_name,msg.from.last_name,msg.from.language_code));
                // gameObjList[i].init();
                var string = `
*𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑷𝒊𝒙𝒆𝒍𝑯𝒚𝒑𝒆𝒓𝑪𝒖𝒃𝒆'𝒔 𝑻𝒊𝒄 𝑻𝒂𝒄 𝑻𝒐𝒆 𝑮𝒂𝒎𝒆 (𝒃𝒆𝒕𝒂)!*
P.S. Since this bot is in it's beta stages of development, some of the functions may not be fully able to work well.
Sorry for any inconveniences caused! Hope you have fun playing!                
-----
𝑪𝒉𝒐𝒐𝒔𝒆 𝒂 𝒈𝒂𝒎𝒆 𝒎𝒐𝒅𝒆!
*1. Player vs CPU (1 Player)*
- You'll be playing against a CPU where it will place symbols after you've inserted something in a cell
*2. Player vs Player - (2 Players)*
- Each player will take turns to place the symbols on the grid.
For instance, Player 1 will place their symbol first, followed by Player 2.
-----
𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨:
/start - Starts a new game
/quit - Quits the game and takes you out of the game

                `;
                bot.sendMessage(chatId,string,{parse_mode:"markdown",
                    'reply_markup':{
                        'keyboard':[['1 - Player vs CPU','2 - Player vs Player'],['/quit']],
                        resize_keyboard:true,
                        one_time_keyboard:true
                    }
                });
            } else if (i==gameObjList.length-1) {
                bot.sendMessage(chatId,"You're already in the game!");
            }
        }
    } else {
        var {id,is_bot,first_name,last_name,language_code} = msg.from;
        gameObjList.push(new TicTacToe(id,is_bot,first_name,last_name,language_code));
        var string = `
*𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑷𝒊𝒙𝒆𝒍𝑯𝒚𝒑𝒆𝒓𝑪𝒖𝒃𝒆'𝒔 𝑻𝒊𝒄 𝑻𝒂𝒄 𝑻𝒐𝒆 𝑮𝒂𝒎𝒆 (𝒃𝒆𝒕𝒂)!*
P.S. Since this bot is in it's beta stages of development, some of the functions may not be fully able to work well.
Sorry for any inconveniences caused! Hope you have fun playing!
-----
𝑪𝒉𝒐𝒐𝒔𝒆 𝒂 𝒈𝒂𝒎𝒆 𝒎𝒐𝒅𝒆!
*1. Player vs CPU (1 Player)*
- You'll be playing against a CPU where it will place symbols after you've inserted something in a cell
- The CPU will instantly place the symbol after you've inserted your symbol
*2. Player vs Player - (2 Players)*
- Each player will take turns to place the symbols on the grid.
- For instance, Player 1 will place their symbol first, followed by Player 2.
-----
𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨:
/start - Starts a new game
/quit - Quits the game and takes you out of the game

        `;
        bot.sendMessage(chatId,string,{parse_mode:"markdown",
        'reply_markup':{
            'keyboard':[['1 - Player vs CPU','2 - Player vs Player'],['/quit']],
            resize_keyboard:true,
            one_time_keyboard:true
        }});
    }
    
    bot.sendMessage(chatId,resp);
});

// Minimax algorithm

function isMovesLeft(gameObj) {
    var board = gameObj.board;
    for (let i = 0;i<3;i++) {
        for (let j = 0;j<3;j++) {
            if (board[i][j] == "-") {
                return true;
            }
        }
    }
    return false;
}

function evaluate(gameObj) {
    var board = gameObj.board;
    var player = gameObj.player_1_symbol;
    var opponent = gameObj.player_2_symbol;
    // Check rows
    for (let row = 0;row<3;row++) {
        if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
            if (board[row][0] == player) {
                return 10;
            } else if (board[row][0]  == opponent) {
                return -10;
            }
        }
    }
    // Check cols
    for(let col = 0; col<3; col++) {
        if (board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
            if (board[0][col] == player) {
                return 10;
            } else if (board[0][col] == opponent) {
                return -10;
            }
        }
    }
    // Check diagonal L to R
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        if (board[0][0] == player) {
            return 10;
        } else if (board[0][0] == opponent) {
            return -10;
        }
    }
    // Check diagonal R to L
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        if (board[0][2] == player) {
            return 10;
        } else if (board[0][2] == opponent) {
            return -10;
        }
    }
    return 0;
}

function minimax(gameObj,depth,isMax) {
    var board = gameObj.board;

    var player = gameObj.player_1_symbol;
    var opponent = gameObj.player_2_symbol;

    let score = evaluate(gameObj);
    if (score==10) {
        return score;
    }
    if (score == -10) {
        return score;
    }
    if (!isMovesLeft(gameObj)) {
        return 0;
    }
    if (isMax) {
        let best = -1000;
        for (let i = 0;i<3;i++) {
            for (let j = 0;j<3;j++) {
                if (board[i][j] == "-") {
                    board[i][j] = player;

                    best = Math.max(best,minimax(gameObj,depth+1,!isMax))

                    board[i][j] = "-";

                }
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let i = 0;i<3;i++) {
            for (let j = 0;j<3;j++) {
                if (board[i][j] == "-") {
                    board[i][j] = opponent;
                    best = Math.min(best,minimax(gameObj,depth+1,!isMax));
                    board[i][j] = "-";
                }
            }
        }
        return best;
    }
}

function bestMove(gameObj) {
    var board = gameObj.board;
    var player = gameObj.player_1_symbol;

    let bestVal = -1000;
    let bestMove = {x:-1,y:-1};

    for (let i = 0;i<3;i++) {
        for (let j = 0;j<3;j++) {
            if (board[i][j] == "-") {
                board[i][j] = player;
                let moveVal = minimax(gameObj,0,false);
                board[i][j] = "-";

                if (moveVal>bestVal) {
                    bestMove.x = j;
                    bestMove.y = i;
                    bestVal = moveVal;
                }
            }
        }
    }
    return bestMove
}

bot.onText(/[123456789XOxo]/g,(msg,match)=>{
    const chatId = msg.chat.id;
    if (gameObjList.length!=0) {
        for (let i = 0;i<gameObjList.length;i++) {
            if (gameObjList[i].id==msg.from.id) {
                // console.log(gameObjList[i].game_stage=="not_started");
                if (gameObjList[i].game_stage=="not_started") {
                    // console.log(msg.text);
                    try {
                        // Testing for matches
                        if (true) {
                            var canProceed = false;
                            if (msg.text=="1 - Player vs CPU") {
                                gameObjList[i].gamemode = 1;
                                canProceed=true;
                            } else if (msg.text=="2 - Player vs Player") {
                                gameObjList[i].gamemode = 2;
                                canProceed=true;
                            } else {
                                bot.sendMessage(chatId,`
𝑪𝒉𝒐𝒐𝒔𝒆 𝒂 𝒈𝒂𝒎𝒆 𝒎𝒐𝒅𝒆!
-----
*1. Player vs CPU (1 Player)*
- You'll be playing against a CPU where it will place symbols after you've inserted something in a cell

-----

*2. Player vs Player - (2 Players)*
- Each player will take turns to place the symbols on the grid.
For instance, Player 1 will place their symbol first, followed by Player 2.
                                `,{
                                    'reply_markup':{
                                        'keyboard':[['1 - Player vs CPU','2 - Player vs Player'],['/quit']],
                                        resize_keyboard:true,
                                        one_time_keyboard:true
                                    },
                                    parse_mode:"Markdown"
                                });
                            }
                            
                            if (canProceed) {
                                gameObjList[i].game_stage = "symbol_selection";
                                // console.log("SENDING")
                                var string = `
                                *Select a symbol*:\n❌\n⭕️
                                `;
                                bot.sendMessage(chatId,string,{
                                    parse_mode:"Markdown",
                                    'reply_markup':{
                                        'keyboard':[['X','O'],['/quit']],
                                        resize_keyboard:true,
                                        one_time_keyboard:true
                                    }
                                });
                                gameObjList[i].selectSymbol();
                            }
                        } 
                        // else {
                        //     bot.sendMessage(chatId,`Choose a game mode! \n1. Player vs CPU (enter 1) - The position of the CPU will be automatically filled \n2. Player vs Player (enter 2) - Requires two people to play`);
                        // }
                    } catch {
                        bot.sendMessage(chatId,`Choose a game mode! \n1. Player vs CPU (enter 1) \n2. Player vs Player (enter 2)`);
                    }
                } else if (gameObjList[i].game_stage=="symbol_selection") {
                    if (msg.text.toUpperCase()=="X") {
                        gameObjList[i].player_1_symbol = "X";
                        gameObjList[i].player_2_symbol = "O";
                    } else if (msg.text.toUpperCase()=="O") {
                        gameObjList[i].player_1_symbol = "O";
                        gameObjList[i].player_2_symbol = "X";
                    } else {
                        var string = `
                        Select a symbol:\n❌\n⭕️
                        `;
                        bot.sendMessage(chatId,string,{
                            parse_mode:"Markdown",
                            'reply_markup':{
                                'keyboard':[['X','O'],['/quit']],
                                resize_keyboard:true,
                                one_time_keyboard:true
                            }
                        });
                        gameObjList[i].selectSymbol(chatId,bot);
                    }
                    if (gameObjList[i].player_1_symbol!=null && gameObjList[i].player_2_symbol!=null) {
                        var outputString = `
To play the game, type a number from 1-9 
and the symbol you chose will be inserted into
the number you've selected:

<code>1 2 3
4 5 6
7 8 9</code>
                           
𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨:
/quit - Quits the game and takes you out of the game

                        `;
                        bot.sendMessage(chatId,outputString,{
                            parse_mode:"HTML",
                            'reply_markup':{
                                'keyboard':[['1','2','3'],['4','5','6'],['7','8','9'],['/quit']],
                                resize_keyboard:true,
                                one_time_keyboard:true
                            }
                        });
                        bot.sendMessage(chatId,`Your chosen symbol: ${gameObjList[i].player_1_symbol}`)
                        gameObjList[i].game_stage="game";
                        if (gameObjList[i].game_mode==1) {
                            bot.sendMessage(chatId,`You start first!`);
                        } else if (gameObjList[i].game_mode==2) {
                            bot.sendMessage(chatId,`
Player 1's symbol - ${gameObjList[i].player_1_symbol}
Player 2's symbol - ${gameObjList[i].player_2_symbol}`)
                            bot.sendMessage(chatId,`Player ${gameObjList[i].selected_player}'s turn`);
                        }
                    }
                } else if (gameObjList[i].game_stage=="game") {
                    var canContinue = false;

                    try {
                        switch (parseInt(msg.text)) {
                            case 1:
                                if (gameObjList[i].board[0][0]=="-") {
                                    gameObjList[i].setCell(0,0,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 2:
                                if (gameObjList[i].board[0][1]=="-") {
                                    gameObjList[i].setCell(1,0,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 3:
                                if (gameObjList[i].board[0][2]=="-") {
                                    gameObjList[i].setCell(2,0,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 4:
                                if (gameObjList[i].board[1][0]=="-") {
                                    gameObjList[i].setCell(0,1,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 5:
                                if (gameObjList[i].board[1][1]=="-") {
                                    gameObjList[i].setCell(1,1,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 6:
                                if (gameObjList[i].board[1][2]=="-") {
                                    gameObjList[i].setCell(2,1,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 7:
                                if (gameObjList[i].board[2][0]=="-") {
                                    gameObjList[i].setCell(0,2,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 8:
                                if (gameObjList[i].board[2][1]=="-") {
                                    gameObjList[i].setCell(1,2,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            case 9:
                                if (gameObjList[i].board[2][2]=="-") {
                                    gameObjList[i].setCell(2,2,gameObjList[i].player_1_symbol);
                                    canContinue = true;
                                } else {
                                    bot.sendMessage(chatId,"This spot has already been taken!");
                                    canContinue = false;
                                }
                                break;
                            default:
                                bot.sendMessage(chatId,"Enter a value between 1-9");
                        }
                        if (gameObjList[i].gamemode==1) {
                            if (gameObjList[i].checkWin()) {
                                gameObjList[i].printBoard(chatId,bot);
                                bot.sendMessage(chatId,"*𝐘𝐨𝐮 𝐰𝐨𝐧 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞!*\n Thanks for playing my Tic Tac Toe game!\n---\n Github Project Link: https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe \n Type /start again to start a new game!",{
                                    'reply_markup':{
                                        'keyboard':[['/start']],
                                        resize_keyboard:true,
                                        one_time_keyboard:true
                                    },
                                    parse_mode:"Markdown"
                                });
                                gameObjList.splice(i,1);
                            } else {
                                if (canContinue) {
                                    var rx = Math.floor(Math.random()*3);
                                    var ry = Math.floor(Math.random()*3);
                                    var bestPos = {x:2,y:2}
                                    if (!gameObjList[i].checkIfAllAreFull()) {
                                        while (gameObjList[i].board[ry][rx]!="-") {
                                            rx = Math.floor(Math.random()*3);
                                            ry = Math.floor(Math.random()*3);
                                        }
                                        var bestPos = bestMove(gameObjList[i]);
                                    } else {
                                        gameObjList[i].printBoard(chatId,bot);
                                        bot.sendMessage(chatId,"*𝐈𝐭'𝐬 𝐚 𝐭𝐢𝐞!*\n-----\n Thanks for playing my Tic Tac Toe game!\n-----\n Github Project Link: https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe \n-----\n Type /start again to start a new game!",{
                                            'reply_markup':{
                                                'keyboard':[['/start']],
                                                resize_keyboard:true,
                                                one_time_keyboard:true
                                            },
                                            parse_mode:"Markdown"
                                        });
                                        gameObjList.splice(i,1);
                                        canContinue = false;
                                    }
                                    if (canContinue) {
                                    
                                        // Stating probability between minimax or bestPos
                                        var probability = Math.random();
                                        if (probability<0.8) {
                                            gameObjList[i].setCell(bestPos.x,bestPos.y,gameObjList[i].player_2_symbol);
                                        } else {
                                            gameObjList[i].setCell(rx,ry,gameObjList[i].player_2_symbol);
                                        }
                                        gameObjList[i].printBoard(chatId,bot);
                                    }
                                    // console.log(gameObjList[i].board[0][0]==gameObjList[i].board[0][1] && gameObjList[i].board[0][1] == gameObjList[i].board[0][2])
                                    if (gameObjList[i].checkWin()) {
                                        bot.sendMessage(chatId,"*𝐂𝐏𝐔 𝐰𝐨𝐧 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞!*\n-----\n Thanks for playing my Tic Tac Toe game!\n-----\n Github Project Link: https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe \n-----\n Type /start again to start a new game!",{
                                            'reply_markup':{
                                                'keyboard':[['/start']],
                                                resize_keyboard:true,
                                                one_time_keyboard:true
                                            },
                                            parse_mode:"Markdown"
                                        });
                                        gameObjList.splice(i,1);
                                    }
                                }
                            }                            
                        } else {
                            if (gameObjList[i].gamemode==2) {
                                if (gameObjList[i].checkWin()) {
                                    bot.sendMessage(chatId,`*Player ${gameObjList[i].selected_player} won the game!*\n-----\n Thanks for playing my Tic Tac Toe game!\n-----\n Github Project Link: https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe \n-----\n Type /start again to start a new game!`,{
                                        'reply_markup':{
                                            'keyboard':[['/start']],
                                            resize_keyboard:true,
                                            one_time_keyboard:true
                                        },
                                        parse_mode:"Markdown"
                                    });
                                    gameObjList[i].printBoard(chatId,bot);
                                    gameObjList.splice(i,1);
                                } else {
                                    if (!gameObjList[i].checkIfAllAreFull()) {
                                        if (canContinue) {
                                            gameObjList[i].changePlayer();
                                        }
                                        gameObjList[i].printBoard(chatId,bot);
                                        bot.sendMessage(chatId,`Player ${gameObjList[i].selected_player}'s turn`,{
                                            'reply_markup':{
                                                'keyboard':[['1','2','3'],['4','5','6'],['7','8','9'],['/quit']],
                                                resize_keyboard:true,
                                                one_time_keyboard:true
                                            },
                                            parse_mode:"Markdown"
                                        });
                                    } else {
                                        gameObjList[i].printBoard(chatId,bot);
                                        bot.sendMessage(chatId,"*𝐈𝐭'𝐬 𝐚 𝐭𝐢𝐞!*\n-----\n Thanks for playing my Tic Tac Toe game!\n-----\n Github Project Link: https://github.com/pixelhypercube/Telegram-Tic-Tac-Toe \n-----\n Type /start again to start a new game!",
                                        {
                                            'reply_markup':{
                                                'keyboard':[['/start']],
                                                resize_keyboard:true,
                                                one_time_keyboard:true
                                            },
                                            parse_mode:"Markdown"
                                        });
                                        gameObjList.splice(i,1);
                                    }
                                }
                            } 
                        }
                    } catch {
                        // bot.sendMessage(chatId,"Enter a number from 1-9");
                    }
                    
                }
            }
        }
    } else {
        bot.sendMessage(chatId,"Type /start to start the game!");
    }
});

bot.onText(/[^123456789XOxo]/g,(msg)=>{
    const chatId = msg.chat.id;
    if (gameObjList.length>=0) {
        for (let i = 0;i<gameObjList.length;i++) {
            if (gameObjList[i].game_stage=="X") {
                bot.sendMessage(chatId,"Type /start to start the game!",{
                    'reply_markup':{
                        'keyboard':[['/start']],
                        resize_keyboard:true,
                        one_time_keyboard:true
                    }
                });
            }
        }
    }
});

bot.onText(/\/serverstats/g,(msg)=>{
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,`
*Server Stats*
Players in-game: ${gameObjList.length}
    `,{
        'reply_markup':{
            'keyboard':[['/start']],
            resize_keyboard:true,
            one_time_keyboard:true
        }
    });
})

app.get("/",(req,res)=>{
    res.status(200).json({"Hey":"There"});
});

app.listen(process.env.PORT,()=>{
    console.log(`Server now listening on: https://phc-tic-tac-toe-bot.herokuapp.com:3000`);
});