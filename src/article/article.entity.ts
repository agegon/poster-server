import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tag } from '../tag/tag.entity';
import { User } from '../user/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  author: User;

  @ManyToMany(() => User)
  @JoinTable()
  favorite: User[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
