const reddit = require('./reddit')
const poll = require('./poll')
const yt = require('./yt')
const fs = require('fs')
const readline = require('readline')
const help = require('./help')
const sendSticker = require('./sendSticker')
const config = require('./config.json')
const ban  = require('./ban')
const sauce = require('./sauce')
const Danbooru = require('danbooru')
const request = require('request')
const imageToBase64 = require('image-to-base64');


const booru = new Danbooru()


exports.message = async function (message) {

//console.log(message)
const bans = fs.createReadStream('bans.txt');
  
const rl = readline.createInterface({
  input: bans,
  output: process.stdout
});
  
for await (const line of rl) {
  if(line.includes(message.from+' '+message.author)) {
  //  gclient.sendText(message.from, 'Banned');
  return
  }
}
if (message.isMedia) {
  if (allSticker.indexOf(message.from) > -1) {
    message.caption = "Sticker"
}
}

if (message.body.toLowerCase().startsWith("allsticker")) {
  if (message.isGroupMsg) {
    gclient.sendText(message.from, 'All Sticker function can\'t be used in groups');
    return
  }
  console.log(allSticker)
  if (message.body.substring(message.body.indexOf(" ") + 1) == "on") {
  allSticker.push(message.from)
  gclient.sendText(message.from, 'All Sticker function turned on');
  } else if (message.body.substring(message.body.indexOf(" ") + 1) == "off") {
    for (let i = 0; i < allSticker.length; i++) {
      if (allSticker[i] == message.from) {
        allSticker.splice(i, 1);
      }
    }
    gclient.sendText(message.from, 'All Sticker function turned off');
    
  } else {

    gclient.sendText(message.from, 'Wrong Parameter');
  }
}

if (message.body === 'Hi') {

    gclient.sendText(message.from, '👋 Hallo I bims Jürgen M.!');

  }


if (message.body.toLowerCase().startsWith('!ban') | message.body.toLowerCase().startsWith('ban') && message.author == config.Admin+"@c.us") {

ban.ban(message)

}

if (message.body.toLowerCase().startsWith('!unban') | message.body.toLowerCase().startsWith('unban') && message.author == config.Admin+"@c.us") {

  ban.unban(message)

}

if (message.body.toLowerCase() === 'ping') {
  gclient.sendText(message.from, 'Pong')
}  

if (message.body.endsWith('?') && message.isGroupMsg == false) {
   if (Math.round(Math.random()) == 1) {
    gclient.sendText(message.from, 'Ja')
  } else {
    gclient.sendText(message.from, 'Nein')
  } 
}

if (message.body == "🤔") {
  if (Math.round(Math.random()) == 1) {
    gclient.sendText(message.from, 'Yes')
  } else {
    gclient.sendText(message.from, 'No')
  } 
}
if (message.body.toLowerCase().startsWith('!danbooru') || message.body.toLowerCase().startsWith('danbooru')) {

  var num = message.body.replace(/^\D+|\D.*$/g, "")
  console.log(num)
  booru.posts({ limit: num, tags: 'rating:explicit order:rank' , page : (Math.floor(Math.random() * 10)+1) }).then(async posts => {

    console.log(posts.length)
     for (let index = 0; index < posts.length; index++) {
       console.log(posts[index].file_url)
       if (posts[index].file_url == undefined || posts[index].file_ext == "zip") {

       }else{
      const url = booru.url(posts[index].file_url)
      const name = `bilder/${posts[index].md5}.${posts[index].file_ext}`
      await new Promise(resolve =>request(posts[index].file_url).pipe(fs.createWriteStream("bilder/"+`${posts[index].md5}.${posts[index].file_ext}`)).on('finish', resolve));
      await gclient.sendImage(
        message.from,
        "bilder/"+`${posts[index].md5}.${posts[index].file_ext}`
      );      
      }
    } 
  })

}

if (message.body.toLowerCase().startsWith('!poll') || message.body.toLowerCase().startsWith('poll')) {

  //console.log(message.chat.groupMetadata.creation)
  gclient.sendText(message.from, 'Still in Testing')
  // console.log(polllist)
  // polllist.push(message.chatId)
  
}

if (message.body.toLowerCase().startsWith('help') || message.body.toLowerCase().startsWith('!help')) {

  help.help(message)

}

if (message.body.startsWith('test')) {
  
  imageToBase64("https://images.vodspy.de/tp/w500h750/6c/6c4de2f0020b268f7128c80325052f69.jpg") // Image URL
    .then(
        (response) => {
         //   console.log(response); // "iVBORw0KGgoAAAANSwCAIA..."
            img = response
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )

  //console.log(img)
  await gclient.sendImageAsSticker(message.from, img);
//
//await gclient.sendText(message.from, 'creating Sticker')
//gclient.sendFile(message.from,'test.mp4', '', '');
// await gclient.sendImageAsStickerGif(message.from, 'https://i.pinimg.com/originals/2a/34/c9/2a34c95330d483685437ae5698b12fd9.gif');


/*   console.log(message)
  members = await gclient.getGroupMembersIds(message.chat.id)
  for (let index = 0; index < members.length; index++) {
    console.log(members[index].user)
  }  */
}


if (message.isMedia & message.caption == "Sticker") {

await gclient.sendText(message.from, 'creating Sticker')
sendSticker.sendSticker(message)

}




if (message.body.toLowerCase().startsWith('!ytdl') || message.body.toLowerCase().startsWith('ytdl')) {

  gclient.sendText(message.from, 'currently disabled')
//  yt.mp4(message)

}


if (message.body.toLowerCase().startsWith('!ytmp3') || message.body.toLowerCase().startsWith('ytmp3')) {

  gclient.sendText(message.from, 'currently disabled')
//  yt.mp3(message)

}


if (message.body.toLowerCase().startsWith("!meme") || message.body.toLowerCase().startsWith("meme")) {

  var anzahlmemes = message.body.split(' ')[1]

  if (anzahlmemes >0 && anzahlmemes <=50) {

    reddit.reddit("",anzahlmemes,message)

  } else {
    
    gclient.sendText(message.from, 'format is \"meme count\"(max 50)');

  }
}

if (message.body.toLowerCase().startsWith('hentai') || message.body.toLowerCase().startsWith('!hentai')) {

  var anzahlmemes = message.body.split(' ')[1]

  if (anzahlmemes >0 && anzahlmemes <=50) {

    reddit.reddit("hentai/",anzahlmemes,message)

  } else {
    
    gclient.sendText(message.from, 'format is \"hentai count\"(max 50)');

  }
}

if (message.body.toLowerCase().startsWith('reddit') || message.body.toLowerCase().startsWith('!reddit')) {

    var num = message.body.replace(/^\D+|\D.*$/g, "")
    var subReddit = message.body.substring(message.body.lastIndexOf(" ") + 1)+"/"

  if (num >0 && num <=50) {

    reddit.reddit(subReddit,num,message)

  } else {
    
    gclient.sendText(message.from, 'format is \"reddit count subreddit\"(max 50)');

  } 
}

if (message.isMedia & message.caption === "Sauce") {

  sauce.sauce(message)

}



delete require.cache[require.resolve('./sendSticker')]
delete require.cache[require.resolve('./reddit')]
delete require.cache[require.resolve('./poll')]
delete require.cache[require.resolve('./yt')]
delete require.cache[require.resolve('./help')]
delete require.cache[require.resolve('./sauce')]
delete require.cache[require.resolve('./config.json')]
}







