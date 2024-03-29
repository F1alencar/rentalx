import { Repository } from "typeorm";

import { AppDataSource } from "../../../../../shared/infra/typeorm";
import { ICreateCarsDTO } from "../../../dtos/ICreateCarsDTO";
import { ICarsRepository } from "../../../repositories/ICarsRepository";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = AppDataSource.getRepository(Car);
  }

  async create({
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    name,
    license_plate,
    specifications,
    id,
  }: ICreateCarsDTO): Promise<Car> {
    const car = this.repository.create({
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      name,
      license_plate,
      specifications,
      id,
    });

    await this.repository.save(car);
    return car;
  }

  async findById(id: string): Promise<Car | null> {
    const car = await this.repository.findOne({
      where: {
        id,
      },
    });

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car | null> {
    const car = await this.repository.findOne({
      where: {
        license_plate,
      },
    });

    return car;
  }

  async findAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder("cars")
      .where("available = :available", { available: true });
    if (brand) {
      carsQuery.andWhere("cars.brand = :brand", { brand });
    }

    if (name) {
      carsQuery.andWhere("cars.name = :name", { name });
    }

    if (category_id) {
      carsQuery.andWhere("cars.category_id = :category_id", { category_id });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where("id = :id")
      .setParameters({ id })
      .execute();
  }
}

export { CarsRepository };
