import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsDate,
  Min,
  Max,
} from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150, unique: true, nullable: true })
  @IsEmail()
  email: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  password: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @IsDate()
  birthday: Date;

  @Column({ type: "varchar", unique: true, nullable: true })
  @Length(8)
  phone: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  street: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  postal_code: string;

  @Column({ type: "varchar", length: 15, unique: true, nullable: true })
  reset_link: string;

  @Column({ type: "boolean", default: false, nullable: true })
  is_admin: boolean;

  @Column({ type: "boolean", default: false, nullable: true })
  is_google_acc: boolean;

  @Column({ type: "boolean", default: false, nullable: true })
  is_facebook_acc: boolean;

  @Column({ type: "timestamp", nullable: true })
  created: Date;
}
