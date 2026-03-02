import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';

@Module({
  providers: [NotesService],
})
export class NotesModule {}
