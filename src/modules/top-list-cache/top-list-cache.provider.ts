import { Injectable } from '@nestjs/common';
import type Redis from 'ioredis';

// make only id compulsory in entity interface?

interface Entity {
  id: string;
  [key: string]: any;
}

@Injectable()
export class TopListCache<T extends Entity> {
  private readonly dataKey = 'data';
  constructor(
    private readonly redisClient: Redis,
    private readonly size: number,
    private readonly key: string,
  ) {}

  private getCurrentYear(): number {
    return new Date().getFullYear();
  }

  async addToTopList(entity: T, score: number, year?: number): Promise<void> {
    const { id } = entity;
    const currentYear = year || this.getCurrentYear();
    const sortedSetKey = `${this.key}:${currentYear}`;

    // Add the id to the sorted set or update the score if it already exists
    await this.redisClient.zadd(sortedSetKey, score, id);

    // Store the entire entity in a separate key to avoid redundancy issues
    await this.redisClient.set(`${this.key}:${this.dataKey}:${id}`, JSON.stringify(entity));

    // Check the size of the sorted set
    const setSize = await this.redisClient.zcard(sortedSetKey);

    // If the set size exceeds the specified limit, get the items that will be trimmed
    if (setSize > this.size) {
      // Get the IDs of the items that will be trimmed
      const itemsToRemove = await this.redisClient.zrange(sortedSetKey, 0, setSize - this.size - 1);

      // Remove these items from the sorted set
      await this.redisClient.zremrangebyrank(sortedSetKey, 0, setSize - this.size - 1);

      // Delete the associated song data for each trimmed item
      const songKeysToDelete = itemsToRemove.map((itemId) => `${this.key}:${this.dataKey}:${itemId}`);
      await this.redisClient.del(...songKeysToDelete);
    }
  }

  async getTopList(limit: number, year?: number): Promise<T[]> {
    const currentYear = year || this.getCurrentYear();
    const sortedSetKey = `${this.key}:${currentYear}`;

    // Adjust limit if it exceeds the size
    let adjustedLimit = limit;
    if (adjustedLimit > this.size) {
      adjustedLimit = this.size;
    }

    // Get the top IDs and scores from the sorted set
    const results = await this.redisClient.zrevrange(sortedSetKey, 0, adjustedLimit - 1, 'WITHSCORES');

    const topList: T[] = [];

    for (let i = 0; i < results.length; i += 2) {
      const id = results[i];
      // Retrieve the full entity object from Redis only if it's stored
      const entityString = await this.redisClient.get(`${this.key}:${this.dataKey}:${id}`);
      if (entityString) {
        const entity: T = JSON.parse(entityString);
        topList.push(entity);
      } else {
        topList.push({ id } as T);
      }
    }
    return topList;
  }

  async removeFromTopList(id: string, year?: number): Promise<void> {
    const currentYear = year || this.getCurrentYear();
    const sortedSetKey = `${this.key}:${currentYear}`;

    // Remove the id from the sorted set
    await this.redisClient.zrem(sortedSetKey, id);

    // Delete the associated entity from Redis
    await this.redisClient.del(`${this.key}:${this.dataKey}:${id}`);
  }
}
