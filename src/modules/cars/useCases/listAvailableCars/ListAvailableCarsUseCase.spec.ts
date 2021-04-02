import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("List Cars", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Brand",
      category_id: "Category_id",
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("shuold ne able to list all available cars by brand", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Brand",
      category_id: "Category_id",
    });

    await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Not Brand",
      category_id: "Category_id",
    });

    const [cars] = await listAvailableCarsUseCase.execute({
      brand: "Car Brand",
    });

    expect(cars).toHaveProperty("id");
    expect(cars.available).toEqual(true);
    expect(cars.brand).toEqual(car.brand);
  });

  it("shuold ne able to list all available cars by name", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Brand",
      category_id: "Category_id",
    });

    await carsRepositoryInMemory.create({
      name: "Car2",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Not Brand",
      category_id: "Category_id",
    });

    const [cars] = await listAvailableCarsUseCase.execute({
      brand: "Car Brand",
    });

    expect(cars).toHaveProperty("id");
    expect(cars.available).toEqual(true);
    expect(cars.name).toEqual(car.name);
  });

  it("shuold ne able to list all available cars by category_id", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Brand",
      category_id: "Category_id",
    });

    await carsRepositoryInMemory.create({
      name: "Car2",
      description: "Car Description",
      daily_rate: 110.0,
      license_plate: "ABC-456",
      fine_amount: 40,
      brand: "Car Not Brand",
      category_id: "Category_id",
    });

    const [cars] = await listAvailableCarsUseCase.execute({
      category_id: car.category_id,
    });

    expect(cars).toHaveProperty("id");
    expect(cars.available).toEqual(true);
    expect(cars.category_id).toEqual(car.category_id);
  });
});
