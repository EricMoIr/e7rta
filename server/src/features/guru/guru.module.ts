import { Module } from '@nestjs/common';
import { GuruController } from './guru.controller';
import { GuruService } from './guru.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draft } from '../../entities/draft.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Draft])],
  controllers: [GuruController],
  providers: [GuruService],
})
export class GuruModule {}
