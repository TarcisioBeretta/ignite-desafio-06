import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder()
      .select("game")
      .from(Game, "game")
      .where("UPPER(game.title) ILIKE :title", { title:`%${param.toUpperCase()}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(0) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder()
      .select("game")
      .from(Game, "game")
			.leftJoinAndSelect("game.users", "user")
      .where("game.id = :id", { id: id })
      .getOne();

		const users = game?.users;
		return users || [];
  }
}
