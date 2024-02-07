import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../article/article.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
