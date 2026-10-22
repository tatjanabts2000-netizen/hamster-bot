// ============================================
// PFOTENWELT - VOLL WoW EDITION
// 11 Rassen + 10 Klassen + Rüstungssystem
// ============================================
var spieler = {};

var RASSEN = {
 "mensch": {name:"Pupkin - Hunde-Welpe", buff:"+Treue +Schnüffeln", ruest:"Leder -> Platte"},
 "zwerg": {name:"Badgerwarden - Dachs", buff:"+Stärke +Ausdauer", ruest:"Clan-Platte"},
 "gnom": {name:"Mousemech - Mäuschen", buff:"+Tüfteln +Flink", ruest:"Tüftler-Leder"},
 "nachtelf": {name:"Moonfox - Mond-Fuchs", buff:"+Magie +Schleichen", ruest:"Mond-Platte"},
 "blutelf": {name:"Emberfox - Feuer-Fuchs", buff:"+Feuer +Surplus", ruest:"Sonnen-Platte"},
 "ork": {name:"Boarling - Wildschwein", buff:"+Wild +Stärke", ruest:"Mythril-Platte"},
 "troll": {name:"Mossfur - Moos-Troll", buff:"+Regeneration", ruest:"Troll-Leder"},
 "taure": {name:"Moo - Kuh-Kälbchen", buff:"+Natur +Leben", ruest:"Natur-Platte"},
 "untot": {name:"Bonemew - Skelett-Kätzchen", buff:"+Geist +Schatten", ruest:"Todes-Platte"},
 "panda": {name:"Pandi - Panda-Bärchen", buff:"+Chi +Entspannung", ruest:"Chi-Platte"},
 "dracthyr": {name:"Drake-Welpe - Drachen", buff:"+Fliegen +Feuer", ruest:"Drachen-Platte"}
};

var KLASSEN = {
 "hexenmeister": {name:"Hexenmeister", skill:"Dämonen-Pfötchen beschwören", pet:"Kleiner Dämon"},
 "druide": {name:"Druide", skill:"Bär/Katze/Eule Gestaltwandlung", pet:"Naturgeist"},
 "paladin": {name:"Paladin", skill:"Heilig + Tank", pet:"Licht-Häschen"},
 "magier": {name:"Magier", skill:"Feuer/Frost/Arkan", pet:"Mana-Kätzchen"},
 "priester": {name:"Priester", skill:"Heilung + Schatten", pet:"Licht-Flauschi"},
 "schamane": {name:"Schamane", skill:"Totems + Elemente", pet:"Totem-Otter"},
 "todesritter": {name:"Todesritter", skill:"Runenklinge, startet Level 55", pet:"Untoter Begleiter"},
 "krieger": {name:"Krieger", skill:"Schwert & Schild", pet:"Kampf-Bär"},
 "schurke": {name:"Schurke", skill:"Dolche + Schleichen", pet:"Schatten-Katze"},
 "jaeger": {name:"Jäger", skill:"Bogen + Tier-Begleiter", pet:"Wolf + Fuchs"}
};

var BEGLEITER = ["Flauschi (Katze)", "Glimmchen (Biene)", "Spuki (Geist)"];

var App = {
onAppStart: function(){
KnuddelsServer.getDefaultChannel().sendMessage("🌟 PFOTENWELT WoW EDITION GESTARTET! 🌟\n/pfotensart um zu beginnen! 11 Rassen + 10 Klassen wie in WoW!");
},
onUserJoined: function(user){
var n=user.getNick();
spieler[n]=spieler[n]||null;
KnuddelsServer.getDefaultChannel().sendMessage("🐾 Willkommen "+n+"! Schreib /pfotenstart um deine PfotenWelt Reise zu beginnen!");
},
onChatMessage: function(user, message){
var nick=user.getNick();
var ch=KnuddelsServer.getDefaultChannel();
var msg=message.trim();
var lower=msg.toLowerCase();
if(!spieler[nick]) spieler[nick]=null;
var p=spieler[nick];

if(lower.startsWith("/pfotenstart") || lower=="!pfotenstart"){
ch.sendMessage("🐾 PFOTENWELT CHARAKTER ERSTELLUNG für "+nick+":\n📜 RASSEN (11): /rasse Mensch, Zwerg, Gnom, Nachtelf, Blutelf, Ork, Troll, Taure, Untot, Panda, Dracthyr\nBeispiel: /rasse Fuchs (für Pupkin) /rasse Dachs /rasse Mäuschen /rasse Eulchen etc.\nAlle Rassen knuffig!");
return;
}
if(lower.startsWith("/rasse ") || lower.startsWith("/r ")){
var rName=msg.split(" ")[1].toLowerCase();
var key=Object.keys(RASSEN).find(k=>k.includes(rName) || RASSEN[k].name.toLowerCase().includes(rName));
if(!key){ 
 // fallback für Fuchs, Bär, Katze etc aus deinen alten
 var map={fuchs:"mensch", baer:"zwerg", katze:"nachtelf", maus:"gnom", eule:"nachtelf", dachs:"zwerg", igel:"gnom", eichhoernchen:"gnom", frosch:"troll", panda:"panda", wolf:"mensch", reh:"taure", schwein:"taure"};
 key=map[rName]||"mensch";
}
spieler[nick]={rasse:key, rassenName:RASSEN[key].name, level:1, exp:0, klasse:null, begleiter:null, ruestung:"Lederwams (einfach)", abzeichen:0};
ch.sendMessage("✅ Rasse gewählt: "+RASSEN[key].name+" | "+RASSEN[key].buff+"\nJetzt Klasse wählen: /klasse Hexenmeister, Druide, Paladin, Magier, Priester, Schamane, Todesritter, Krieger, Schurke, Jäger\nBeispiel: /klasse Druide");
return;
}
if(lower.startsWith("/klasse ") || lower.startsWith("/k ")){
if(!p || !p.rasse){ch.sendMessage("❌ Erst /pfotenstart + /rasse wählen!"); return;}
var kName=msg.split(" ")[1].toLowerCase();
var kKey=Object.keys(KLASSEN).find(k=>k.includes(kName));
if(!kKey){ch.sendMessage("❌ Klasse nicht gefunden. Verfügbar: Hexenmeister, Druide, Paladin, Magier, Priester, Schamane, Todesritter, Krieger, Schurke, Jäger"); return;}
p.klasse=kKey;
var startLevel = (kKey=="todesritter")?55:1;
p.level=startLevel;
ch.sendMessage("✅ Klasse: "+KLASSEN[kKey].name+" - "+KLASSEN[kKey].skill+"\nBegleiter-Typ: "+KLASSEN[kKey].pet+"\nDein Start-Level: "+startLevel+"\nJetzt Begleiter wählen: /begleiter Flauschi, Glimmchen, Spuki");
return;
}
if(lower.startsWith("/begleiter ") || lower.startsWith("/b ")){
if(!p || !p.klasse){ch.sendMessage("❌ Erst Rasse + Klasse!"); return;}
var bName=msg.split(" ").slice(1).join(" ").toLowerCase();
var found=BEGLEITER.find(b=>b.toLowerCase().includes(bName));
if(!found) found=BEGLEITER[0];
p.begleiter=found;
ch.sendMessage("💙 Begleiter gewählt: "+found+"! [Als Begleiter aufnehmen] erfolgreich!\n🎉 CHARAKTER FERTIG: "+p.rassenName+" + "+KLASSEN[p.klasse].name+" + "+found+"!\nLevel "+p.level+" | Rüstung: "+p.ruestung+"\nBefehle: !pfote !quest !sammeln !inventar");
return;
}
if(lower=="!pfote" || lower=="!char"){
if(!p || !p.begleiter){ch.sendMessage("❌ Du hast noch keinen Char! /pfotenstart"); return;}
var ruest="Level 1-10: Lederwams | 10-25: Kettenrüstung | 25-40: Pfoten-Platte | 40-60: Epische "+RASSEN[p.rasse].ruest;
ch.sendMessage("🐾 "+nick+" - "+p.rassenName+" "+KLASSEN[p.klasse].name+" Level "+p.level+"\n💙 Begleiter: "+p.begleiter+"\n🛡️ Rüstung: "+p.ruestung+"\n"+ruest+"\nExp: "+p.exp+"/"+(p.level*20));
return;
}
if(lower=="!sammeln"){
if(!p || !p.begleiter){ch.sendMessage("❌ /pfotenstart zuerst!"); return;}
var exp=Math.floor(Math.random()*5)+3;
p.exp+=exp;
ch.sendMessage("🐾 Du + "+p.begleiter+" sammelt "+exp+" EXP! (Quest: Sammle Waldbeeren) Jetzt "+p.exp+"/"+(p.level*20));
if(p.exp>=p.level*20){p.level++; p.exp=0; 
if(p.level>=10 && p.level<25) p.ruestung="Kettenrüstung";
else if(p.level>=25 && p.level<40) p.ruestung="Pfoten-Platte";
else if(p.level>=40) p.ruestung="Epische "+RASSEN[p.rasse].ruest;
ch.sendMessage("🎉 LEVEL UP! "+nick+" jetzt Level "+p.level+"! Neue Rüstung: "+p.ruestung+"!"); 
}
return;
}
if(lower=="!quest"){
ch.sendMessage("📜 QUEST: Sammle Waldbeeren 3/3 bei Oma Pfötchen | Oma Pfötchens Küche | Belohnung: 5 Korn + Pfötchendorf Ruf");
return;
}
if(lower=="!inventar" || lower=="!inv"){
if(!p) return;
ch.sendMessage("🎒 Inventar: Rüstung "+p.ruestung+" | Abzeichen "+p.abzeichen+" | Begleiter "+p.begleiter);
}
}
};
