function User(id,is_bot,first_name,last_name,language_code,game_obj) {
    this.id = id;
    this.is_bot = is_bot;
    this.first_name = first_name;
    this.last_name = last_name;
    this.language_code = language_code;
    this.game_obj = game_obj;
}

module.exports = User;