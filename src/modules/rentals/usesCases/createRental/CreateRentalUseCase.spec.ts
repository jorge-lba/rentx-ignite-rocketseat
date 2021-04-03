import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryinMemory";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateProvider: IDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "123456",
      car_id: "121212",
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

    await createRentalUseCase.execute(rentalData);

    await expect(async () => {
      await createRentalUseCase.execute(rentalData);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new rental if there is another open to the same user", async () => {
    const rentalData = {
      user_id: "123456",
      car_id: "test",
      expected_return_date: dayAdd24Hours,
    };

    await createRentalUseCase.execute(rentalData);

    await expect(async () => {
      await createRentalUseCase.execute({
        ...rentalData,
        user_id: "654321",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new rental with invalid return time", async () => {
    const rentalData = {
      user_id: "123456",
      car_id: "test",
      expected_return_date: dayjs().toDate(),
    };

    const result = expect(async () => {
      await createRentalUseCase.execute(rentalData);
    }).rejects;

    await result.toBeInstanceOf(AppError);
    await result.toEqual({
      message: "Invalid rental time, time must be greater than 24 hours!",
      statusCode: 400,
    });
  });
});
