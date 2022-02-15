import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import * as bcrypt from "bcryptjs";
import { classToPlain, Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150, unique: true, nullable: false })
  @IsEmail()
  email!: string;

  @Column({ type: "varchar", length: 150, nullable: true, select: false })
  @Exclude()
  password!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  first_name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  last_name!: string;

  @Column({ nullable: true, type: "timestamptz" })
  birthday!: Date;

  @Column({ type: "varchar", unique: true, nullable: true })
  @MaxLength(9)
  @MinLength(9)
  phone!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  country!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  city!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  street!: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  postal_code!: string;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  reset_link!: string;

  @Column({ nullable: true })
  //@IsNotEmpty()
  role!: string;

  @Column({ type: "boolean", default: false, nullable: true })
  is_google_acc!: boolean;

  @Column({ type: "boolean", default: false, nullable: true })
  is_facebook_acc!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  checkPassword(password: string) {
    let errors = [];
    console.log("check pass", password);
    if (password.length < 8) {
      errors.push("Hasło powinno mieć conajmniej 8 znaków.");
    }
    if (password.search(/[a-z]/g) < 0) {
      errors.push("Hasło musi zawierać przynajmniej jedną małą literę.");
    }
    if (password.search(/[A-Z]/g) < 0) {
      errors.push("Hasło powinno zawierać przynajmniej jedną dużą literę.");
    }
    if (password.search(/[0-9]/) < 0) {
      errors.push("Hasło musi zawierać przynajmniej jedną liczbę.");
    }
    if (password.search(/[!@#$%^&*]/) < 0) {
      errors.push("Hasło powinno zawierać przynajmniej jeden znak specjalny.");
    }

    return errors;
  }
}
