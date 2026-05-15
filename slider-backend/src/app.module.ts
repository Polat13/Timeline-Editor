import { Module } from '@nestjs/common';
import { TimelineModule } from './timeline/timeline.module';

@Module({
  imports: [TimelineModule],
})
export class AppModule {}