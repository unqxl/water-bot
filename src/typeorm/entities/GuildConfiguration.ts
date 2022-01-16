import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_configuration" })
export class GuildConfiguration {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	guild_id: string;

	@Column({ default: "en-US" })
	locale: string;

	@Column({ default: "-" })
	prefix: string;

	@Column({ nullable: true })
	members_channel: string;

	@Column({ nullable: true })
	log_channel: string;

	@Column({ nullable: true })
	twitch_channel: string;

	@Column({ nullable: true })
	levels_channel: string;

	@Column({ nullable: true })
	auto_role: string;

	@Column({ nullable: true })
	mute_role: string;
}
