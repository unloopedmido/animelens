export const emojis = {
	github: "<:github:1414137575798472714>",
	spotify: "<:spotify:1414138589637509120>",
	youtube: "<:youtube:1414137041620570142>",
	animethemes: "<:animethemes:1414137799313064019>",
	myanimelist: "<:myanimelist:1414137135082115112>",
	top_gg: "<:top_gg:1417323021022269491>",
	discord: "<:discord:1417323281916104714>",
};

export const apis = {
	myanimelist: "https://api.myanimelist.net/v2",
	myanimelistOAuth: "https://myanimelist.net/v1/oauth2",
	animethemes: "https://api.animethemes.moe",
	jikan: "https://api.jikan.moe/v4",
	discordbotsgg: "https://discord.bots.gg/api/v1",
	discordbotlist: "https://discordbotlist.com/api/v1",
	topgg: "https://top.gg/api",
};

export const WEBSITE_URL = "https://animelens.nonlooped.xyz";
export const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${Bun.env.DISCORD_CLIENT_ID || "1386365602167390289"}`;
export const VOTE_URLS = {
	topgg: "https://top.gg/bot/1386365602167390289/vote",
	discordbotlist: "https://discordbotlist.com/bots/animelens",
	botlistme: "https://botlist.me/bots/1386365602167390289",
};
