import { ICreateCarsDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { AppError } from "@shared/errors/AppError";

import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id,
  }: ICreateCarsDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
      id,
    });

    await this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    const cars =
      brand || category_id || name
        ? this.cars
            .filter((car) => car.available === true)
            .filter(
              (car) =>
                (brand && car.brand === brand) ||
                (category_id && car.category_id === category_id) ||
                (name && car.name === name)
            )
        : this.cars.filter((car) => car.available === true);
    return cars;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex((car) => car.id === id);
    this.cars[findIndex].available = available;
  }
}

export { CarsRepositoryInMemory };
