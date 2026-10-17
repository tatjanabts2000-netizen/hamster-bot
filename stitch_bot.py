import os
import discord
from discord.ext import commands
import threading
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hamster ist online!"

def run_flask():
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 10000)))

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Online als {bot.user}")

@bot.command()
async def hamster(ctx):
    await ctx.send("🐹 Hamster rennt!")

if __name__ == "__main__":
    threading.Thread(target=run_flask, daemon=True).start()
    bot.run(os.environ.get("DISCORD_TOKEN"))
