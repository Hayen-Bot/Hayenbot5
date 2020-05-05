require('http').createServer().listen(3000)

//Iniciar Bot
const discord = require('discord.js');
const kystel = new discord.Client();
kystel.login("NzA3Mjc0MDY3ODA3NDM2ODEx.XrGabw.BgrBaIzuMcK30nWoF3CjF28SN1w");

//Youtube Package
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const {YouTubeAPIKey} = require('./config/Credentials.json');

//Handler
const ready = require('./config/ready.js');
const message = require('./config/message.js');

//DataBase
const firebase = require('firebase');
var dbco = {
  apiKey: "AIzaSyDhNMn_XwPgwBPrcbNXPE4i3W0Bbn-5cHA",
  authDomain: "https://hayen-bot.firebaseio.com",
  databaseURL: "https://hayen-bot.firebaseio.com",
  projectId: "Hayen-86173804564",
  storageBucket: "",
  messagingSenderId: "86173804564",
  appId: "1:86173804564:web:00e00e435358fd6ce9df01"
  };
  firebase.initializeApp(dbco);
  const dbf = firebase.database();


//Configuração
const config = require('./config/Config.json');
const utils = require('./config/utils.js');

//Extra

const fs = require('fs-extra');
const invites = {};
const moment = require("moment");


//Inicializador

const krystel = new discord.Client();
require('./config/functions')(krystel, utils, ytdl, config);


//Anti Flood

const authors = [];
const warned = [];
const banned = [];
const messagelog = [];

//Anti Links

krystel.APIWEB = "WEB_CODE";
krystel.URLWEB = "http://217.182.8.62/webapi.php"



//Handler Do Comando Play

krystel.commands = new discord.Collection();
krystel.aliases = new discord.Collection();
krystel.youtube = new YouTube("AIzaSyB6_jByHJk1Eu2UdhjE-4tGNoG7hFQvoWk"); // YouTube Client
krystel.queue = new Map() // Music Queue
krystel.votes = new Map(); // Vote Skip
ready.ready(krystel);
message.message(krystel, utils, config, discord);

krystel.on('ready', () => {

    console.log('================================')
    console.log('= Krystel Iniciada Com Sucesso =')
    console.log('================================')
    console.log('=   Krystel DataBase Iniciada  =')
    console.log('================================')

    //Invites

    krystel.guilds.forEach(g => {
      g.fetchInvites().then(guildInvites => {
          invites[g.id] = guildInvites;
      });
  });

});

krystel.on('guildCreate', guild => {

  dbf.ref(`Servidores/${guild.id}/`)
  .once('value').then(async function(snap) {
    if (snap.val() == null) {
     dbf.ref(`Servidores/${guild.id}/`)
        .set({
          Nome: guild.name,
          ID: guild.id,
          Autorole: 0,
          Autoroletag: '',
          Contador: 0,
          ContadorChannel: '',
          ContadorMensagem: 'Membros: {count} sejam bem vindos ao servidor!',
          RegistroStaff: '',
          RegistroMenina: '',
          RegistroMenino: '',
          BemVindo: 0,
          BemVindoChannel: '',
          BemVindoMensagem: '',
          BemVindoMensagemType: 0,
          BemVindoPrivado: 0,
          BemVindoMensagemPrivado: '',
          BemVindoEmbedImagem: 0,
          BemVindoEmbedImagemURL: '',
          Saida: 0,
          SaidaChannel: '',
          SaidaMensagem: '',
          Logs: 0,
          LogsChannel: '',
          Links: '',
          Invites: 0,
          InvitesChannel: '',
          ProteçãoBots: 0,
          ProteçãoLinks: 0,
          ProteçãoRaid: 0,
          ProteçãoFlood: 0,
          NSFW: 0,
          NSFWChannel: '',
          LogsRaid: 0,
          LogsChannelRaid: '',
          Premium: 0,
          PTBR: 1,
          ES: 0,
          EN: 0,
          Caixa: 0,
          Caixatipo: 'Comum'
        });
      };
  });
});


krystel.on('message', async message => {
  global.Xp = '';
  global.nextLevel = '';
  global.msg = '';

  let xpAdd = Math.floor(Math.random() * 7) + 8;

  dbf.ref(`Membros/${message.author.id}/`)
  .once('value').then(async function(snap) {
    if (snap.val() == null) {
      dbf.ref(`Membros/${message.author.id}/`)
        .set({
          Level: 1,
          Xp: 0,
          Dev: 0,
          Des: 0,
          Sup: 0,
          Owner: 0,
          Ban: 0,
          Sobre: 'Use `sobre` para definir seu sobre!',
          Background: 'https://images3.alphacoders.com/727/thumb-1920-727869.png',
          Coins: 1000,
          Reputação: 1,
          AfkI: 0,
          AfkMotivo: '',
          Clan: 0,
          ClanNome: '',
          ClanCargo: 0,
          Comum: 0,
          Rara: 0,
          Epica: 0,
          Lendaria: 0,
          TimeDaily: '86400000'        
        });
      } else {
        Xp = snap.val().Xp + xpAdd;
        nextLevel = snap.val().Level * 600;
        dbf.ref(`Membros/${message.author.id}/`)
          .update({
            Xp: Xp
          })
  
        if (nextLevel <= Xp) {
          nextLevel = snap.val().Level + 1;
          dbf.ref(`Membros/${message.author.id}/`)
          .update({
            Level: nextLevel
          })
        }
      }
  });
});

krystel.on('message', async message => {
  if(message.author.bot === false) {
   message.mentions.users.array().forEach(async mention => {
    dbf.ref(`Membros/${mention.id}/`)
    .once('value').then(async function(snap){
      let AfkI = snap.val().AfkI;
      let AfkMotivo = snap.val().AfkMotivo
      if(AfkI === 1) {
        message.channel.send(`**<:soninho:578719585461731350> | <@${mention.id}> está ausente!
Razão:** \`${AfkMotivo}\``).then(m => m.delete(5000));
      }
    })
  })
}


dbf.ref(`Membros/${message.author.id}`)
.once('value').then(async function(snap){
  let AfkI = snap.val().AfkI;
  if (AfkI === 1) {
    dbf.ref(`Membros/${message.author.id}`)
    .once('value').then(async function(snap){
        let AfkI = snap.val().AfkI;
        let AfkMotivo = snap.val().AfkMotivo;
        AfkMotivo = snap.val().AfkMotivo = '';
        AfkI = snap.val().AfkI = 0;
        dbf.ref(`Membros/${message.author.id}`)
        .update({
          AfkI: AfkI,
          AfkMotivo: AfkMotivo
        })
    });

    message.channel.send(`**<:emoji_12:592135515764031498> Bem-vindo de volta! <@${message.author.id}>, você não está mais ausente.**`).then(m => m.delete(5000));
  }
})
})

krystel.on('guildMemberAdd', async member => {

  dbf.ref(`Servidores/${member.guild.id}`)
  .once('value').then(async function(snap){
    let Autorole = snap.val().Autorole;
    let AutoRoleTag = snap.val().AutoRoleTag;
    let ProteçãoBots = snap.val().ProteçãoBots;
    if(Autorole === 1) {
      let role = member.guild.roles.find(`name`, `${AutoRoleTag}`);
      member.addRole(role.id)
    }
    if(ProteçãoBots === 1) {
      if(member.user.bot) {
        member.ban('Krystel Proteção BOT Ligada')
      }
    }
  })
})

krystel.on('guildBanAdd', (guild, user) => {

  dbf.ref(`Servidores/${guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(user.avatarURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Ban`)
      .addField('Usuário:', `<@${user.id}>`)
      .addField('ID:', `${user.id}`)
      .setTimestamp()

      const logChannel = guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
});

krystel.on('guildBanRemove', (guild, user) => {

  dbf.ref(`Servidores/${guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(user.avatarURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `UnBan`)
      .addField('Usuário:', `<@${user.id}>`)
      .addField('ID:', `${user.id}`)
      .setTimestamp()

      const logChannel = guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
});

krystel.on('channelCreate', async (channel) => {

  dbf.ref(`Servidores/${channel.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(channel.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Criamento De Canal`)
      .addField('Nome Do Canal:', `${channel.name}`)
      .addField('ID Do Canal:', `${channel.id}`)
      .addField('Tipo Do Canal:', `${channel.type}`)
      .addField('As:', `${channel.createdAt}`)
      .setTimestamp()

      const logChannel = channel.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
})

krystel.on('channelDelete', async (channel) => {

  dbf.ref(`Servidores/${channel.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(channel.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Removedor De Canal`)
      .addField('Nome Do Canal:', `${channel.name}`)
      .addField('ID Do Canal:', `${channel.id}`)
      .addField('Tipo Do Canal:', `${channel.type}`)
      .addField('As:', `${channel.createdAt}`)
      .setTimestamp()

      const logChannel = channel.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
})

krystel.on('roleCreate', async (role) => {

  dbf.ref(`Servidores/${role.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(role.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Criamento De Cargo`)
      .addField('Nome Do Cargo:', `${role.name}`)
      .addField('ID Do Cargo:', `${role.id}`)
      .addField('As:', `${role.createdAt}`)
      .setTimestamp()

      const logChannel = role.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
})

krystel.on('roleDelete', async (role) => {

  dbf.ref(`Servidores/${role.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(role.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Removedor De Cargo`)
      .addField('Nome Do Cargo:', `${role.name}`)
      .addField('ID Do Cargo:', `${role.id}`)
      .addField('As:', `${role.createdAt}`)
      .setTimestamp()

      const logChannel = role.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
})

krystel.on('emojiCreate', async (emoji) => {

  dbf.ref(`Servidores/${emoji.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(emoji.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Criador De Emoji`)
      .addField('Nome Do Emoji:', `${emoji.name}`)
      .addField('ID Do Emoji:', `${emoji.id}`)
      .addField('As:', `${emoji.createdAt}`)
      .setTimestamp()

      const logChannel = emoji.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
})

krystel.on('emojiDelete', async (emoji) => {

  dbf.ref(`Servidores/${emoji.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      let embed = new discord.RichEmbed()
      .setThumbnail(emoji.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Removedor De Emoji`)
      .addField('Nome Do Emoji:', `${emoji.name}`)
      .addField('ID Do Emoji:', `${emoji.id}`)
      .addField('As:', `${emoji.createdAt}`)
      .setTimestamp()

      const logChannel = emoji.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
    };
  });
})

krystel.on('messageDelete', async (message) => {

  dbf.ref(`Servidores/${message.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      if(message.author.bot === false) {

      let embed = new discord.RichEmbed()
      .setThumbnail(message.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Removedor De Mensagem`)
      .addField('Author Da Mensagem:', `<@${message.author.id}>`)
      .addField('ID Da Mensagem:', `${message.id}`)
      .addField('Canal Da Mensagem:', `${message.channel}`)
      .addField('Mensagem:', `\`${message}\``)
      .addField('As:', `${message.createdAt}`)
      .setTimestamp()

      const logChannel = message.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
      };
    };
  });
})

krystel.on('messageUpdate', async (message) => {

  dbf.ref(`Servidores/${message.guild.id}`)
  .once('value').then(async function(snap){
    let Logs = snap.val().Logs;
    let LogsChannel = snap.val().LogsChannel;
    if(Logs === 1) {

      if(message.author.bot === false) {

      let embed = new discord.RichEmbed()
      .setThumbnail(message.guild.iconURL)
      .setColor('#9026cf')
      .setTitle('**<:emoji_25:593250556974202883> Logs <:emoji_25:593250556974202883>**')
      .addField('Função:', `Removedor De Mensagem`)
      .addField('Author Da Mensagem:', `<@${message.author.id}>`)
      .addField('ID Da Mensagem:', `${message.id}`)
      .addField('Canal Da Mensagem:', `${message.channel}`)
      .addField('Mensagem Antiga:', `\`${message}\``)
      .addField('Mensagem Nova:', `\`${message.edits}\``)
      .addField('As:', `${message.createdAt}`)
      .setTimestamp()

      const logChannel = message.guild.channels.find(channel => channel.id === `${LogsChannel}`);
      logChannel.send(embed);
      };
    };
  });
})



krystel.on('guildMemberAdd', async member => {

  dbf.ref(`Servidores/${member.guild.id}`)
  .once('value').then(async function(snap){
    let Invites = snap.val().Invites;
    let InvitesChannel = snap.val().InvitesChannel;
    if(Invites === 1) {
        // To compare, we need to load the current invite list.
        member.guild.fetchInvites().then(guildInvites => {
          // This is the *existing* invites for the guild.
          const ei = invites[member.guild.id];
          // Update the cached invites for the guild.
          invites[member.guild.id] = guildInvites;
          // Look through the invites, find the one for which the uses went up.
          const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
          // This is just to simplify the message being sent below (inviter doesn't have a tag property)
          const inviter = krystel.users.get(invite.inviter.id);
          // Get the log channel (change to your liking)
          const logChannel = member.guild.channels.find(channel => channel.id === `${InvitesChannel}`);
          // A real basic message with the information we need. 
          let embed2 = new discord.RichEmbed()
          .setColor('#9026cf')
          .setThumbnail(member.avatarURL)
          .addField('Convite:', `${invite.code}`)
          .addField('Membro:', `<@${member.id}>`, true)
          .addField('ID:', `${member.id}`, true)
          .addField('De:', `<@${inviter.id}>`, true)
          .addField('ID:', `${inviter.id}`, true)
          logChannel.send(embed2);
        });
    }
  })
})





krystel.on('message', async message => {

  dbf.ref(`Servidores/${message.guild.id}`)
  .once('value').then(async function(snap){
    let ProteçãoLinks = snap.val().ProteçãoLinks;
    let LogsChannel = snap.val().LogsChannel;
    let Logs = snap.val().LogsChannel;

    if(ProteçãoLinks == 1) {
    if(message.author.bot) return;
    if (message.content.includes('discord.gg') || message.content.includes('.gg') || message.content.includes("d i s c o r d . g g" ) || message.content.includes(". g g" ) || message.content.includes('d.i.s.c.o.r.d.g.g')){
    if (message.member.hasPermission('ADMINISTRATOR')) return;

    if (Logs == 1) {
    let embedreport = new discord.RichEmbed()
    .setColor('#9026cf')
    .setDescription('**<:emoji_25:593250556974202883> Logs Proteção Links <:emoji_25:593250556974202883>**')
    .addField('Usuário:', `${message.author}`)
    .addField('URL:', `${message.content}`)
    .addField('Canal:', `${message.channel}`)
    .addField('As:', `${message.createdAt}`)
    const channelreport = message.guild.channels.find(channel => channel.id === `${LogsChannel}`);
    channelreport.send(embedreport);
        }
    let embedstop = new discord.RichEmbed()
    .setColor('#9026cf')
    .setDescription(`**<:emoji_11:592135468070600714> \`${message.author.username}\` Você não pode enviar links aqui.**`)
    .setTimestamp()
    message.channel.send(embedstop).then(m => m.delete(12000));
    message.delete(1);
      }
    }
  })
})

krystel.on('guildMemberAdd', async member => {

  dbf.ref(`Servidores/${member.guild.id}`)
  .once('value').then(async function(snap) {

    let BemVindo = snap.val().BemVindo;
    let BemVindoChannel = snap.val().BemVindoChannel;
    let BemVindoMensagem = snap.val().BemVindoMensagem;

    if (BemVindo == 1) {
      let message = BemVindoMensagem

      let boasvindascanalchannel = member.guild.channels.find(channel => channel.id === `${BemVindoChannel}`);
      boasvindascanalchannel.send(message.replace(/{usuario}/g, `<@${member.id}>`).replace(/{guild}/g, `${member.guild.name}`).replace(/{name}/g, `${member.displayName}`)).catch(()=>{});

    }
  })
});

krystel.on('guildMemberAdd', member => {

       function contador(_números) {
                      _números = _números.toString();
                      var texto = ``, números = { 1: 'a:A1:575197202989711360', 2: 'a:A2:575197205103902730', 3: 'a:A3:575197203719651328', 4: 'a:A4:575197202054512640', 5: 'a:A5:575197203333775361', 6: 'a:A6:575197203480576003', 7: 'a:A7:575197203598147585', 8: 'a:A8:575197204386545852', 9: 'a:A9:575197204319436801', 0: 'a:A0:575197204638203904' };
                  
                      for(let i =0; i < _números.length; i++) texto += '<' + números[parseInt(_números[i])] + '>';
                  
                     return texto;
                  }

                  function contador2(_números2) {
                    _números2 = _números2.toString();
                    var texto = ``, números2 = { 1: 'a:F1:575197293574357003', 2: 'a:F2:575197294287388672', 3: 'a:F3:575197293767163944', 4: 'a:F4:575197293951713281', 5: 'a:F5:575197294182268939', 6: 'a:F6:575197294849163274', 7: 'a:F7:575197294035599362', 8: 'a:F8:5751972993876215808', 9: 'a:F9:575197294920466432', 0: 'a:F0:575197294736179220' };
                
                    for(let i =0; i < _números2.length; i++) texto += '<' + números2[parseInt(_números2[i])] + '>';
                
                   return texto;
                }

                function contador3(_números3) {
                  _números3 = _números3.toString();
                  var texto = ``, números3 = { 1: 'a:B1:575197249429307432', 2: 'a:B2:575197249663926284', 3: 'a:B3:575197249949401088', 4: 'a:B4:575197250150465536', 5: 'a:B5:575197249047625738', 6: 'a:B6:575197248993099818', 7: 'a:B7:575197250553380894', 8: 'a:B8:575197250326626315', 9: 'a:B9:575197248535920650', 0: 'a:B0:575197248657555466' };
              
                  for(let i =0; i < _números3.length; i++) texto += '<' + números3[parseInt(_números3[i])] + '>';
              
                 return texto;
              }

              function contador4(_números4) {
                _números4 = _números4.toString();
                var texto = ``, números4 = { 1: 'a:C1:594264439050731540', 2: 'a:C2:594264439071703040', 3: 'a:C3:594267768174411809', 4: 'a:C4:594264439126229002', 5: 'a:C5:594264439063183370', 6: 'a:C6:594264440137056256', 7: 'a:C7:594264439230955553', 8: 'a:C8:594264438820044802', 9: 'a:C9:594264439067377668', 0: 'a:C0:594264439046537216' };
            
                for(let i =0; i < _números4.length; i++) texto += '<' + números4[parseInt(_números4[i])] + '>';
            
               return texto;
            }

            function contador5(_números5) {
              _números5 = _números5.toString();
              var texto = ``, números5 = { 1: 'a:1D:594293649991532555', 2: 'a:2D:594293651174064153', 3: 'a:3D:594293650717147169', 4: 'a:4D:594293651127926784', 5: 'a:5D:594293652281360422', 6: 'a:6D:594293650960416798', 7: 'a:7D:594293650653970483', 8: 'a:8D:594293650725535755', 9: 'a:9D:594294390550167572', 0: 'a:0D:594293650771410945' };
          
              for(let i =0; i < _números5.length; i++) texto += '<' + números5[parseInt(_números5[i])] + '>';
          
             return texto;
          }

          dbf.ref(`Servidores/${member.guild.id}`)
          .once('value').then(async function(snap){
            let Contador = snap.val().Contador;
            let ContadorChannel = snap.val().ContadorChannel;
            let ContadorMensagem = snap.val().ContadorMensagem;

            if(Contador == 1) {            
                  let channeltopic = member.guild.channels.find(channel => channel.id === `${ContadorChannel}`);
                  channeltopic.setTopic(ContadorMensagem.replace(/{contador}/g, `${contador(member.guild.memberCount)}`).replace(/{contador2}/g, `${contador2(member.guild.memberCount)}`).replace(/{contador3}/g, `${contador3(member.guild.memberCount)}`).replace(/{contador4}/g, `${contador4(member.guild.memberCount)}`).replace(/{contador5}/g, `${contador5(member.guild.memberCount)}`));
            }
                });
})


krystel.on('message', message => {
  if(message.author.bot) return;
  if(message.guild == null) return;


  dbf.ref(`Servidores/${message.guild.id}`)
  .once('value').then(async function(snap){
    let Caixa = snap.val().Caixa;
    let Caixatipo = snap.val().Caixatipo;

    let prc = Math.round(Math.random() * 1340)
    if (prc == 133) {


      database.ref(`Servidores/${message.guild.id}/`)
      .update({
          Caixa: snap.val().Caixa = 1,
          Caixatipo: snap.val().Caixatipo = 'Lendaria',
        })


        let embedlendaria = new discord.RichEmbed()
        .setColor('#9026cf')
        .setTitle('**<:emoji_28:593252236721913856> Uma caixa lendaria foi dropada!**')
        .setDescription('**<:emoji_28:593252236721913856> Rápido! pege-a antes que todos! \n Use: \`k.getbox\` para capturá-la.')
        .setImage("https://cdn.discordapp.com/attachments/530756115500236800/575624717520601088/unknown.png")
        .setFooter('KrystelProtection 2k19, Todos direitos reservados.')
        message.channel.send(embedlendaria)
    } else if(prc == 1333) {


      database.ref(`Servidores/${message.guild.id}/`)
      .update({
          Caixa: snap.val().Caixa = 1,
          Caixatipo: snap.val().Caixatipo = 'Epica',
        })


        let embedepica = new discord.RichEmbed()
        .setColor('#9026cf')
        .setTitle('**<:emoji_28:593252236721913856> Uma caixa epica foi dropada!**')
        .setDescription('**<:emoji_28:593252236721913856> Rápido! pege-a antes que todos! \n Use: \`k.getbox\` para capturá-la.')
        .setImage("https://cdn.discordapp.com/attachments/530756115500236800/575624610394013707/unknown.png")
        .setFooter('KrystelProtection 2k19, Todos direitos reservados.')
        message.channel.send(embedepica)
    } else if(prc == 1339) {

      database.ref(`Servidores/${message.guild.id}/`)
      .update({
          Caixa: snap.val().Caixa = 1,
          Caixatipo: snap.val().Caixatipo = 'Rara',
        })


        let embedrara = new discord.RichEmbed()
        .setColor('#9026cf')
        .setTitle('**<:emoji_28:593252236721913856> Uma caixa rara foi dropada!**')
        .setDescription('**<:emoji_28:593252236721913856> Rápido! pege-a antes que todos! \n Use: \`k.getbox\` para capturá-la.')
        .setImage("https://cdn.discordapp.com/attachments/530756115500236800/575624667167981598/unknown.png")
        .setFooter('KrystelProtection 2k19, Todos direitos reservados.')
        message.channel.send(embedrara)
    } else if(prc == 1339) {

      database.ref(`Servidores/${message.guild.id}/`)
      .update({
          Caixa: snap.val().Caixa = 1,
          Caixatipo: snap.val().Caixatipo = 'Comum',
        })


        let embedcomum = new discord.RichEmbed()
        .setColor('#9026cf')
        .setTitle('**<:emoji_28:593252236721913856> Uma caixa comum foi dropada!**')
        .setDescription('**<:emoji_28:593252236721913856> Rápido! pege-a antes que todos! \n Use: \`k.getbox\` para capturá-la.')
        .setImage("https://cdn.discordapp.com/attachments/530756115500236800/575624667167981598/unknown.png")
        .setFooter('KrystelProtection 2k19, Todos direitos reservados.')
        message.channel.send(embedcomum)

    }
  })
})