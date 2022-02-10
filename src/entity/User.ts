import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Contains, IsInt, Length, IsEmail, IsDate, Min, Max} from "class-validator";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar",
             length: 150,
             unique: true, 
             nullable: false   
            })
    @IsEmail()
    email: string;

    @Column({type: "varchar",
             length: 50,
             nullable: false                
            })
    password: string;

    @Column({type: "varchar", length: 150})
    firstName: string;

    @Column({type: "varchar", length: 255})
    lastName: string;

    @Column()
    @IsDate()
    birthday: Date;

    @Column({type: "varchar",              
             unique: true })
    @Length(8)
    phone: string;

    @Column({type: "varchar",
            length: 100                        
    })    
    country: string;   

    @Column({type: "varchar",
            length: 100                        
    })    
    city: string; 
    
    @Column({type: "varchar",
             length: 255                        
    })    
    street: string; 

    @Column({type: "varchar",
             length: 15
    })    
    postal_code: string; 
        
    @Column({type: "varchar",
             length: 15,
             unique: true
    })    
    reset_link: string; 
    
    @Column({type: "boolean", 
             default: false             
    })    
    is_admin: boolean; 

    @Column({type: "boolean", 
        default: false             
    })    
    is_google_acc: boolean; 

    @Column({type: "boolean", 
        default: false             
    })    
    is_facebook_acc: boolean; 
    
    
    @Column({ type: 'timestamp', nullable: false })
    created: Date;
         
}
