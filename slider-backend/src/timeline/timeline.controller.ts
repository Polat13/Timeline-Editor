import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { TimelineDto } from './dto/timeline.dto';
import { TimelineService } from './timeline.service';

@ApiTags('timeline')
@Controller('timeline')
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @ApiOperation({ summary: 'Yeni timeline kaydı oluşturur' })
  @ApiBody({ type: CreateTimelineDto })
  @ApiCreatedResponse({
    description: 'Oluşturulan timeline kaydı',
    type: TimelineDto,
  })
  @Post()
  create(@Body() body: CreateTimelineDto) {
    return this.service.createTimeline(body);
  }

  @ApiOperation({ summary: 'Tüm timeline kayıtlarını listeler' })
  @ApiOkResponse({
    description: 'Timeline kayıtları',
    type: TimelineDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.service.getAll();
  }
}
