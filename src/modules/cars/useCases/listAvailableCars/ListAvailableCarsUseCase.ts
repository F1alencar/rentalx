import { inject, injectable } from "tsyringe";

import { Car } from "../../infra/typeorm/entities/Car";
import { ICarsRepository } from "../../repositories/ICarsRepository";

interface IRequest {
  category_id?: string;
  brand?: string;
  name?: string;
}
@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRespository: ICarsRepository
  ) {}
  async execute({ category_id, brand, name }: IRequest): Promise<Car[]> {
    const cars = await this.carsRespository.findAvailable(
      category_id,
      brand,
      name
    );

    return cars;
  }
}

export { ListAvailableCarsUseCase };
