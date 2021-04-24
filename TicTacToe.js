//const bot = new TelegramBot(botToken,{polling:true});

class TicTacToe {
    constructor(id,is_bot,first_name,last_name,language_code) {
        this.gamemode = 0;
        this.board = [
            ['-','-','-'],
            ['-','-','-'],
            ['-','-','-']
        ];
        this.id = id;
        this.is_bot = is_bot;
        this.first_name = first_name;
        this.last_name = last_name;
        this.language_code = language_code;
        this.game_stage = "not_started";
        this.player_1_symbol = null;
        this.player_2_symbol = null;
        this.selected_player = 1;
        // this.init();
    }
    init(chatId,bot) {
        var string = `
        *Welcome to PixelHyperCube's Tic Tac Toe Game!*
Choose a game mode!
1. Player vs CPU (enter 1)
2. Player vs Player (enter 2)
        `;
        bot.sendMessage(chatId,string,{parseMode:"markdown"});
    }
    selectSymbol(chatId,bot) {
        
    }
    printBoard(chatId,bot) {
        var outputTxt = "";

        /*
        
   |   |   
-----------
   | X |   
-----------
   |   |   
        
        */
        for (let i = 0;i<this.board.length;i++) {
            for (let j = 0;j<this.board[i].length;j++) {
                if (this.board[i][j]=="O") {
                    outputTxt += `⭕ `;
                } else if (this.board[i][j]=="X") {
                    outputTxt += `❌ `;
                } else if (this.board[i][j]=="-") {
                    outputTxt += `➖ `;
                }
                // outputTxt += `${this.board[i][j]} `;
            }
            outputTxt += "\n";
        }
        // Some hardcoding
//         var outputTxt = `
//  ${this.board[0][0]}  | ${this.board[0][1]} | ${this.board[0][2]}  
// -----------
//  ${this.board[1][0]}  | ${this.board[1][1]} | ${this.board[1][2]}  
// -----------
//  ${this.board[2][0]}  | ${this.board[2][1]} | ${this.board[2][2]}  
//         `;

        bot.sendMessage(chatId,`<code>${outputTxt}</code>`,{parse_mode:"HTML",
        'reply_markup':{
            'keyboard':[['1','2','3'],['4','5','6'],['7','8','9']],
            resize_keyboard:true,
            one_time_keyboard:false
        }
    });
    }
    checkWin() {
        // Check row
        var player1Count = 0;
        var player2Count = 0;
        for (let i = 0;i<3;i++) {
            player1Count = 0;
            player2Count = 0;
            for (let j = 0;j<3;j++) {
                if (this.board[i][j]==this.player_1_symbol) {
                    player1Count+=1;
                    if (player1Count==3) {
                        return true;
                    }
                } else if (this.board[i][j]==this.player_2_symbol) {
                    player2Count+=1;
                    if (player2Count==3) {
                        return true;
                    }
                }
            }
            
        }
        // Check col
        for (let i = 0;i<3;i++) {
            player1Count = 0;
            player2Count = 0;
            for (let j = 0;j<3;j++) {
                if (this.board[j][i]==this.player_1_symbol) {
                    player1Count+=1;
                    if (player1Count==3) {
                        return true;
                    }
                } else if (this.board[j][i]==this.player_2_symbol) {
                    player2Count+=1;
                    if (player2Count==3) {
                        return true;
                    }
                }
            }
        }
        if (player1Count==3 || player2Count==3) {
            return true;
        }
        // Check L to R diagonal
        for (let i = 0;i<2;i++) {
            if (this.board[i][i]==this.board[i+1][i+1]) {
                if (i==1 && (this.board[i][i]!="-" || this.board[i+1][i+1]!="-")) {
                    return true;
                }
            } else {
                break;
            }
        }
        // Check R to L diagonal
        for (let i = 0;i<2;i++) {
            if (this.board[i][2-i]==this.board[i+1][1-i]) {
                // console.log(this.board[i][2-i],this.board[i+1][1-i])
                if (i==1 && (this.board[i][2-i]!="-" || this.board[i+1][1-i]!="-")) {
                    return true;
                }
            } else {
                break;
            }
        }
        return false;
    }
    checkIfAllAreFull() {
        for (let i = 0;i<3;i++) {
            for (let j = 0;j<3;j++) {
                if (this.board[i][j]=="-") {
                    return false;
                }
            }
        }
        return true;
    }
    setCell(x,y,character) {
        this.board[y][x] = character;
    }
    changePlayer() {
        this.player = (this.selected_player==1)?this.selected_player=2:this.selected_player=1;
        var temp = this.player_1_symbol;
        this.player_1_symbol = this.player_2_symbol;
        this.player_2_symbol = temp;
    }
}

module.exports = TicTacToe;