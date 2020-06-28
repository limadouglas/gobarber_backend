import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
class User extends Repository<User> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
