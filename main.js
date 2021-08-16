const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')
const fetch = require("node-fetch")

require('./index.js')
nocache('./index.js', module => console.log(`${module} is now updated!`))

const starts = async (client = new WAConnection()) => {
    client.logger.level = 'warn'
    client.version = [2, 2123, 8]
    client.browserDescription = [ 'hehe boy', 'Chrome', '3.0' ]
    console.log(banner.string)
    client.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')
    client.on('connecting', () => {
        start('2', 'Connecting...')
    })
    client.on('open', () => {
        success('2', 'Connected')
    })
    await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    client.on('chat-update', async (message) => {
        require('./index.js')(client, message)
    })
    
        client.on('group-update', async (anu) => {
            metdata = await client.groupMetadata(anu.jid)
              if(anu.announce == 'false'){
              teks = `- [ Group Opened ] -\n\n_Group telah dibuka oleh admin_\n_Sekarang semua member bisa mengirim pesan_`
              client.sendMessage(metdata.id, teks, MessageType.text)
              console.log(`- [ Group Opened ] - In ${metdata.subject}`)
            }
            else if(anu.announce == 'true'){
              teks = `- [ Group Closed ] -\n\n_Group telah ditutup oleh admin_\n_Sekarang hanya admin yang dapat mengirim pesan_`
              client.sendMessage(metdata.id, teks, MessageType.text)
              console.log(`- [ Group Closed ] - In ${metdata.subject}`)
            }
            else if(!anu.desc == ''){
              tag = anu.descOwner.split('@')[0] + '@s.whatsapp.net'
              teks = `- [ Group Description Change ] -\n\nDeskripsi Group telah diubah oleh Admin @${anu.descOwner.split('@')[0]}\n� Deskripsi Baru : ${anu.desc}`
              client.sendMessage(metdata.id, teks, MessageType.text, {contextInfo: {"mentionedJid": [tag]}})
              console.log(`- [ Group Description Change ] - In ${metdata.subject}`)
            }
            else if(anu.restrict == 'false'){
              teks = `- [ Group Setting Change ] -\n\nEdit Group info telah dibuka untuk member\nSekarang semua member dapat mengedit info Group Ini`
              client.sendMessage(metdata.id, teks, MessageType.text)
              console.log(`- [ Group Setting Change ] - In ${metdata.subject}`)
            }
            else if(anu.restrict == 'true'){
              teks = `- [ Group Setting Change ] -\n\nEdit Group info telah ditutup untuk member\nSekarang hanya admin group yang dapat mengedit info Group Ini`
              client.sendMessage(metdata.id, teks, MessageType.text)
              console.log(`- [ Group Setting Change ] - In ${metdata.subject}`)
            }
          })
          client.on('group-participants-update', async (anu) => {
            try {
            
            mem = anu.participants[0]
                console.log(anu)
                try {
                pp_user = await client.getProfilePicture(mem)
                } catch (e) {
                pp_user = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                }
                try {
                pp_grup = await client.getProfilePicture(anu.jid)
                } catch (e) {
                pp_grup = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
                }
                if (anu.action == 'add' && mem.includes(client.user.jid)) {
                    client.sendMessage(anu.jid, 'okoklh', 'conversation')
                    }
                     if (anu.action == 'add' && !mem.includes(client.user.jid)) {
                        mdata = await client.groupMetadata(anu.jid)
                        memeg = mdata.participants.length
                        num = anu.participants[0]
                        let v = client.contacts[num] || { notify: num.replace(/@.+/, '') }
                        anu_user = v.vname || v.notify || num.split('@')[0]
                        time_wel = moment.tz('Asia/Jakarta').format("HH:mm")
                        teks = `Halo ${anu_user} \n\nNama : \nUmur :\nGender : \nAsal :\n\nSemoga Betah dan jangan lupa isi\nAnd Following Rules Group`
                        buff = await getBuffer(`http://hadi-api.herokuapp.com/api/card/welcome?nama=${anu_user}&descriminator=${time_wel}&memcount=${memeg}&gcname=${encodeURI(mdata.subject)}&pp=${pp_user}&bg=https://i.postimg.cc/rFkw8MpX/IMG-20210807-151325.jpg`)
                        buttons = [{buttonId: `y`,buttonText:{displayText: 'Welcome👋'},type:1}]
                        imageMsg = (await client.prepareMessageMedia((buff), 'imageMessage', {thumbnail: buff})).imageMessage
                        buttonsMessage = { contentText: `${teks}`, footerText: 'Semoga betah ☕', imageMessage: imageMsg, buttons: buttons, headerType: 4 }
                        prep = await client.prepareMessageFromContent(mdata.id,{buttonsMessage},{})
                        client.relayWAMessage(prep)
        }
                    if (anu.action == 'remove' && !mem.includes(client.user.jid)) {
                        mdata = await client.groupMetadata(anu.jid)
                        num = anu.participants[0]
                        let w = client.contacts[num] || { notify: num.replace(/@.+/, '') }
                        anu_user = w.vname || w.notify || num.split('@')[0]
                        time_wel = moment.tz('Asia/Jakarta').format("HH:mm")
                        memeg = mdata.participants.length
                        out = `Kenapa tuh? kok bisa keluar? \nSayonara ${anu_user} we will miss you`
                        buff = await getBuffer(`http://hadi-api.herokuapp.com/api/card/goodbye?nama=${anu_user}&descriminator=${time_wel}&memcount=${memeg}&gcname=${encodeURI(mdata.subject)}&pp=${pp_user}&bg=https://i.postimg.cc/rFkw8MpX/IMG-20210807-151325.jpg`)
                        buttons = [{buttonId: `y`,buttonText:{displayText: 'Sayonara👋'},type:1}]
                        imageMsg = (await client.prepareMessageMedia((buff), 'imageMessage', {thumbnail: buff})).imageMessage
                        buttonsMessage = { contentText: `${out}`, footerText: 'Nitip gorengan ya', imageMessage: imageMsg, buttons: buttons, headerType: 4 }
                        prep = await client.prepareMessageFromContent(mdata.id,{buttonsMessage},{})
                        client.relayWAMessage(prep)
                    }
                if (anu.action == 'promote') {
                const mdata = await client.groupMetadata(anu.jid)
                anu_user = client.contacts[mem]
                num = anu.participants[0]
                try {
                        ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
                    } catch {
                        ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                let buff = await getBuffer(ppimg)
                teks = `@${num.split('@')[0]} Telah dipromote`
                client.sendMessage(mdata.id, teks, MessageType.text) 
            }
            
                if (anu.action == 'demote') {
                anu_user = client.contacts[mem]
                num = anu.participants[0]
                const mdata = await client.groupMetadata(anu.jid)
                try {
                        ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
                    } catch {
                        ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                
                let buff = await getBuffer(`https://gatauajg.yogipw.repl.co/api/demote?name=${anu_user.notify}&msg=selamat%20menjadi%20admin&mem=${groupAdmins.length}&picurl=${ppimg}&bgurl=https://cdn.discordapp.com/attachments/819995259261288475/835055559941292032/style.jpg`)
                teks = `@${num.split('@')[0]} Telah didemote`
                client.sendMessage(mdata.id, teks, MessageType.text) 
        }
            } catch (e) {
                console.log('Error : %s', color(e, 'red'))
            }
        })
        }
        
        
/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
