import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { type Connection } from 'mongoose';

@Injectable()
export class MongoHealth {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async ping(): Promise<void> {
    const db = this.connection.db;
    if (db === undefined) {
      throw new Error('MongoDB is not connected');
    }
    await db.command({ ping: 1 });
  }
}
