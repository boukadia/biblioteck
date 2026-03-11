import { Module } from '@nestjs/common';
import { ActivitesService } from './activites.service';

@Module({
    providers: [ActivitesService],
})
export class ActivitesModule { }
