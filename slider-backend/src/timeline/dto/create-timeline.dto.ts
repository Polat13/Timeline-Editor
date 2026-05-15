import { ApiProperty } from '@nestjs/swagger';

export class CreateTimelineDto {
  @ApiProperty({
    example: 'Yeni timeline notu',
    description: 'Timeline kaydının metin içeriği',
  })
  content!: string;

  @ApiProperty({
    example: '2026-05-14T09:30:00.000Z',
    description: 'Kaydın oluşturulma zamanı',
  })
  createdAt!: string;
}
