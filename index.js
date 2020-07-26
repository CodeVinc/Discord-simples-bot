const express = require('express')
const path = require('path')
var unirest = require('unirest');
var app = express();

const { Client, RichEmbed } = require('discord.js');

var http = require("http");
var getJSON = require("simple-get-json");

const PORT = process.env.PORT || 8080
const client = new Client();
require("babel-polyfill");

express().use(express.static(path.join(__dirname, 'public')))
.listen(PORT, () => console.log(`Listening on ${ PORT }`));

client.on('ready', () => {
  client.user.setActivity("NADA",{type: "PLAYING"});
  
  console.log(client.user.username + " iniciado com sucesso!");

  setInterval(function() {
    http.get("http://discord-app-ls.herokuapp.com");
  }, 600000); // 10 minutos
});

client.on('message', msg => 
{
  const prefix = "!"
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'ajuda') 
  {
    msg.reply(`\n!tk @usuario : Remove o usuario mencionado\n!pm @usuario texto_aqui : Envia uma mensagem de texto privada`)
  }
});

client.on('message', msg => {

  const prefix = "!"
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

    if(command === "pm"){
    {
        const user = msg.mentions.users.first();

        if(user){

          const member = msg.guild.member(user);

          if(member){

            const text = args.slice(1).join(""); //pega a segundo palavra em diante

            if(text != "")
            {
              member.send(text);
            }
            else{
              msg.reply("Você precisa escrever uma mensagem, Ex: !pm @username seu texto aqui")
            }
          }
          else{
            msg.reply("Usuario não encontrado!");
          }
        }
        else {
          msg.reply("Necessario mencionar um membro, Ex: @username");
      }
    }
  }
});

client.on('message', message => {

  if (!message.guild) return;
  
  if (message.content.startsWith('!tk')) {

    const user = message.mentions.users.first();
    const perms = message.member.permissions;
    const has_kick = perms.has("KICK_MEMBERS");

    if(has_kick)
    {
      if (user) {

        const member = message.guild.member(user);

        if (member) {
            member.kick(`Usuario removido por ${message.author.username}`).then(() => {
            message.reply(`${member.displayName} Removido`);
            console.log(`Usuario ${member.displayName} removido por ${message.author.username}`)

          }).catch(err => {
            message.reply(`Não foi possivel remover ${member.displayName}`);
            console.error(err);
          });
        } else {
          message.reply('Usuario não encontrado');
        }

      } else {
        message.reply('Nenhum usuario mencionado para remover!');
      }
    }
    else{
      const embed = new RichEmbed()

      .setTitle('ERRO 404')

      .setDescription("Você não tem permissão para usar esse comando!")

      .setColor(0x000000)

      .setFooter("Em caso de duvidas procure um moderador")

      message.channel.send(embed);
    }
  }
});

client.on("guildMemberAdd", (member) => {
  console.log(`User ${member.user.username} has joined in ${member.guild.name}` );
});

client.login('SEU KEY');
