const express = require('express');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');
const { Markup } = require('telegraf');
const { Context } = require('telegraf');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

bot.start((ctx) => {
    ctx.reply('Benvenuto! Come posso aiutarti oggi?',
    Markup.inlineKeyboard([
        [Markup.button.callback("/help", "help")],
        [Markup.button.callback("/newgame", "newgame")],
        [Markup.button.callback("/newwhite", "newwhite")],
        [Markup.button.callback("/newblack", "newblack")],
        [Markup.button.callback("/startapp", "startapp")]
      ]).resize());
  });

bot.help((ctx) => {
    ctx.reply('Scrivi /newgame per iniziare una nuova partita');
    ctx.reply('Scrivi /startapp per avviare l\'applicazione');
    ctx.reply('Scrivi /newwhite per creare una nuova partita come bianco');
    ctx.reply('Scrivi /newblack per creare una nuova partita come nero');
});

(async () => {
    await bot.launch();
    app.use(await bot.createWebhook({ domain: process.env.WEBHOOK_DOMAIN || "localhost" }));
})();

// Funzioni gestione comandi
bot.command('startapp', ctx => {
    ctx.reply(`App starting at ${process.env.WEB_APP_URI}`)
})

bot.command('newwhite', ctx => {
    ctx.reply("Coming soon...");
})

bot.command('newblack', ctx => {
    ctx.reply("Coming soon...");
})

bot.command('newgame', ctx => {
    ctx.reply(`New game starting at ${process.env.WEB_APP_URI}}`)
})


// Funzioni gestione callback
bot.action('help', (ctx) => {
    ctx.reply('Scrivi /newgame per iniziare una nuova partita');
    ctx.reply('Scrivi /startapp per avviare l\'applicazione');
    ctx.reply('Scrivi /newwhite per creare una nuova partita come bianco');
    ctx.reply('Scrivi /newblack per creare una nuova partita come nero');
})

bot.action('startapp', (ctx) => {
    ctx.reply(`App starting at ${process.env.WEB_APP_URI}`)
})

bot.action('newwhite', (ctx) => {
    ctx.reply("Coming soon...");
})

bot.action('newblack', (ctx) => {
    ctx.reply("Coming soon...");
})

bot.action('newgame', (ctx) => {
    ctx.reply(`New game starting at ${process.env.WEB_APP_URI}}`)
})

app.get("/health", (req, res) => {
    res.send({status: "OK"});
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 4000}`);
})