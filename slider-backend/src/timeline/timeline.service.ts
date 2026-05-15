import { Injectable } from '@nestjs/common';
import { pool } from './db';
import { CreateTimelineDto } from './dto/create-timeline.dto';

@Injectable()
export class TimelineService {
  async createTimeline(data: CreateTimelineDto) {
    const query = `
      INSERT INTO timeline (content, created_at)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const values = [data.content, data.createdAt];

    const result = await pool.query(query, values);

    return result.rows[0];
  }

  async getAll() {
    const result = await pool.query('SELECT * FROM timeline ORDER BY id DESC');

    return result.rows;
  }
}
