function chat_send(){
    var temp = document.getElementById("chat_input").value;        
    var data  = {};
    data ["login"] = window.my_user_object.login;
    data ["message"] = temp;

    window.connection.send("chat_message", data);
    document.getElementById("chat_input").value="";  
    var textList = document.getElementById("textList");
    textList.scrollTop = textList.scrollHeight;
    return false;
}

