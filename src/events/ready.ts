import type DiscordClient from "@classes/client";
import { ActivityType } from "discord.js";
import { Event } from "@classes/event";
import { apis } from "@util/constants";
import { prisma } from "@util/db";
import { app } from "@web/index";
import registerCommands from "@util/register";
import consola from "consola";

export default class ReadyEvent extends Event<"clientReady"> {
	constructor() {
		super({
			name: "clientReady",
			once: true,
		});
	}

	public override async execute(client: DiscordClient): Promise<void> {
		const activities = [
			{ name: `/help | anime & manga`, type: ActivityType.Watching },
			{ name: `anime data for you`, type: ActivityType.Playing },
			{ name: `animelens.nonlooped.xyz`, type: ActivityType.Watching },
		];
		let current = 0;
		const setNextActivity = () => {
			client.user!.setActivity(activities[current]!.name, {
				type: activities[current]!.type,
			});
			current = (current + 1) % activities.length;
		};
		setNextActivity();
		setInterval(setNextActivity, 60 * 1000).unref?.();

		consola.success(
			`Logged in as ${client.user!.username} (${client.user!.id})`,
		);
		consola.success(
			`Ready to serve ${client.users.cache.size} user(s) in ${client.guilds.cache.size} servers.`,
		);
		await registerCommands(client, Bun.env.NODE_ENV === "development");

		try {
			const now = new Date();
			const result = await prisma.cooldown.deleteMany({
				where: { expiresAt: { lt: now } },
			});
			if (result.count > 0) {
				consola.info(
					`Cleaned up ${result.count} expired cooldown(s) on startup.`,
				);
			} else {
				consola.info("No expired cooldowns to clean up on startup.");
			}
		} catch (err) {
			consola.warn("Failed to clean up expired cooldowns on startup", err);
		}

		setInterval(
			async () => {
				try {
					const now = new Date();
					const result = await prisma.cooldown.deleteMany({
						where: { expiresAt: { lt: now } },
					});
					if (result.count > 0) {
						consola.info(
							`Periodic cleanup removed ${result.count} expired cooldown(s).`,
						);
					}
				} catch (err) {
					consola.warn("Periodic cooldown cleanup failed", err);
				}
			},
			30 * 60 * 1000,
		).unref?.(); // Cleanup every 30 minutes

		try {
			await fetch(apis.discordbotsgg + `/bots/${client.user?.id}/stats`, {
				method: "POST",
				headers: {
					Authorization: `${Bun.env.DB_GG_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					guildCount: client.guilds.cache.size,
					shardCount: client.shard?.count ?? 1,
					shardId: client.shard?.ids[0] ?? 0,
				}),
			});
		} catch {}

		app.listen(Bun.env.PORT, () => {
			consola.success(`Server running on port ${Bun.env.PORT}`);
		});
	}
}
