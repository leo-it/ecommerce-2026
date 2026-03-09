import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'parent_id' })
  parentCategory: Category | null;

  @OneToMany(() => Category, (c) => c.parentCategory)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
  
}