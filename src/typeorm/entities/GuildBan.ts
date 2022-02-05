import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_bans" })
export class GuildBan {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	guild_id: string;

	@Column()
	banned_member_id: string;

	@Column()
	issued_by: string;

	@Column()
	reason?: string;
    
    @Column()
    creation_date: Date;
}
