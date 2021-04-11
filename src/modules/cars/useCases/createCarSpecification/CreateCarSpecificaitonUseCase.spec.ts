import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

describe("Create car specification", () => {
  let carsRepositoryInMemory: CarsRepositoryInMemory;
  let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
  let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it("should not be able to add a new specification to a now-existent car", async () => {
    const car_id = "1234";
    const specifications_id = ["54321"];

    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError("Car does not exists!"));
  });

  it("should be able to add a new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-123",
      fine_amount: 60,
      brand: "Brand",
      category_id: "Category",
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: "Test Name",
      description: "Test Description",
    });

    const specifications_id = [specification.id];

    const specificationCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationCars).toHaveProperty("specifications");
    expect(specificationCars.specifications).toHaveLength(1);
  });
});
