import { ApiProperty } from '@nestjs/swagger';

export class TimelineDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Yeni timeline notu' })
  content!: string;

  @ApiProperty({ example: '2026-05-14T09:30:00.000Z' })
  created_at!: string;
}
