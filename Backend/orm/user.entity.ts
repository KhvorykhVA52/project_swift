import {

    Entity,
  
    Column,
  
    PrimaryGeneratedColumn,
  
    CreateDateColumn,
  
    UpdateDateColumn,
  
    VersionColumn,
  
  } from 'typeorm';
  
   
  
  import { Role, UserAccountStatus, SecuredUser } from 'src/common/types';
  
   
  
  @Entity()
  
  export class User {
  
    @PrimaryGeneratedColumn()
  
    id: number;
  
   
  
    @Column()
  
    name: string;
  
   
  
    @Column()
  
    passwordHash: string;
  
   
  
    @Column({ default: '' })
  
    firstname: string;
  
   
  
    @Column({ default: '' })
  
    lastname: string;
  
   
  
    @Column({ type: 'varchar', default: [Role.user], array: true })
  
    roles: Role[];
  
   
  
    @Column({ default: UserAccountStatus.pending })
  
    status: UserAccountStatus;
  
   
  
    @CreateDateColumn({ name: 'created_at' })
  
    createdAt!: Date;
  
   
  
    @UpdateDateColumn({ name: 'updated_at' })
  
    UpdatedAt!: Date;
  
   
  
    @VersionColumn()
  
    version!: number;
  
   
  
    getSecuredDto(): SecuredUser {
  
      return {
  
        id: this.id,
  
        name: this.name,
  
        firstname: this.firstname,
  
        lastname: this.lastname,
  
        roles: this.roles,
  
        status: this.status,
  
      };
  
    }
  
  }
  
  