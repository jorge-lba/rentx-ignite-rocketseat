import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryinMemory";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: IDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();

    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "Car Test",
      daily_rate: 100,
      license_plate: "TEST",
      fine_amount: 40,
      category_id: "1234",
      brand: "Brand Test",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "123456",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should be able to create a new rental if there is another open to the same user", async () => {
    const rentalData = {
      user_id: "123456",
      car_id: "121212",
      expected_return_date: dayAdd24Hours,
    };

    await rentalsRepositoryInMemory.create(rentalData);

    await expect(
      createRentalUseCase.execute({
        ...rentalData,
        car_id: "13321",
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user!"));
  });

  it("should be able to create a new rental if there is another open to the same user", async () => {
    const rentalData = {
      user_id: "123456",
      car_id: "test",
      expected_return_date: dayAdd24Hours,
    };

    await rentalsRepositoryInMemory.create(rentalData);

    await expect(
      createRentalUseCase.execute({
        ...rentalData,
        user_id: "654321",
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should be able to create a new rental with invalid return time", async () => {
    const rentalData = {
      user_id: "123456",
      car_id: "test",
      expected_return_date: dayjs().toDate(),
    };

    await expect(createRentalUseCase.execute(rentalData)).rejects.toEqual(
      new AppError("Invalid rental time, time must be greater than 24 hours!")
    );
  });
});
