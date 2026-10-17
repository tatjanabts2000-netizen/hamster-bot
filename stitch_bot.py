import os
import discord
from discord.ext import commands
import threading
from flask import Flask

app = Flask(__name__)
@app.route('/')
def home():
    return "Hamster ist online! 🐹"

def run_flask():
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 10000)))

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix=["!", "?", "/"], intents=intents)

SHOP = {
    "normal": {"price": 100, "emoji": "🐹", "name": "Normal Hamster"},
    "selten": {"price": 500, "emoji": "🐹✨", "name": "Seltener Hamster"},
    "legendary": {"price": 2000, "emoji": "🐹👑", "name": "Legendary Hamster"}
}

user_hamsters = {}

@bot.event
async def on_ready():
    print(f"✅ Online als {bot.user}")

@bot.command(name="hamster")
async def hamster_cmd(ctx):
    await ctx.send("🐹 Hamster rennt! Tippe `!shop` für den Shop!")

@bot.command(name="shop")
async def shop_cmd(ctx):
    embed = discord.Embed(
        title="🐹 AustrianSee's Hamster Farm Shop",
        description="Tippe `!buy <name>` um zu kaufen!",
        color=0xf4a460
    )
    for key, item in SHOP.items():
        embed.add_field(
            name=f"{item['emoji']} {item['name']}",
            value=f"Befehl: `!buy {key}`\nPreis: {item['price']} Coins",
            inline=False
        )
    await ctx.send(embed=embed)

@bot.command(name="buy")
async def buy_cmd(ctx, hamster_type: str = None):
    if not hamster_type:
        await ctx.send("❓ Nutzung: `!buy normal` / `!buy selten` / `!buy legendary`")
        return
    hamster_type = hamster_type.lower()
    if hamster_type not in SHOP:
        await ctx.send("❌ Gibt es nicht!")
        return
    item = SHOP[hamster_type]
    user_id = str(ctx.author.id)
    if user_id not in user_hamsters:
        user_hamsters[user_id] = []
    user_hamsters[user_id].append(hamster_type)
    await ctx.send(f"✅ Du hast einen {item['name']} gekauft! {item['emoji']}")

@bot.command(name="garden")
async def garden_cmd(ctx):
    user_id = str(ctx.author.id)
    hamsters = user_hamsters.get(user_id, [])
    if not hamsters:
        await ctx.send("🌱 Dein Garten ist leer! Kauf mit `!shop` einen Hamster!")
        return
    text = ""
    for h in hamsters:
        text += f"{SHOP[h]['emoji']} {SHOP[h]['name']}\n"
    embed = discord.Embed(
        title=f"🌻 {ctx.author.name}'s Garten",
        description=text,
        color=0x90ee90
    )
    await ctx.send(embed=embed)

@bot.command(name="ping")
async def ping_cmd(ctx):
    await ctx.send(f"🏓 Pong! {round(bot.latency*1000)}ms")

if __name__ == "__main__":
    threading.Thread(target=run_flask, daemon=True).start()
    bot.run(os.environ.get("DISCORD_TOKEN"))
