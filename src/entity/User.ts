import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsDate,
  Min,
  Max,
} from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150, unique: false, nullable: true })
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

  @Column({ type: "varchar", unique: false, nullable: true })
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

  @Column({ type: "varchar", length: 15, unique: false, nullable: true })
  reset_link: string;

  @Column({ type: "boolean", default: false, nullable: true })
  is_admin: boolean;

  @Column({ type: "boolean", default: false, nullable: true })
  is_google_acc: boolean;

  @Column({ type: "boolean", default: false, nullable: true })
  is_facebook_acc: boolean;

  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
