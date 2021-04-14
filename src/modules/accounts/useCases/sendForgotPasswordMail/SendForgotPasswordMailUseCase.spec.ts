import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRespositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in_memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: IDateProvider;
let mailProvider: MailProviderInMemory;

describe("Send Forgot Password Mail Use Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = await spyOn(mailProvider, "sendMail");

    const user = usersRepositoryInMemory.create({
      driver_license: "344620002",
      email: "hohepen@ka.tr",
      name: "Isabella Sanchez",
      password: "54b66b47",
    });

    await sendForgotPasswordMailUseCase.execute("hohepen@ka.tr");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to send an email if user does not exists", async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute("obboj@jacuvaf.hk")
    ).rejects.toEqual(new AppError("User does not exists!"));
  });

  it("should be able to create a new users token", async () => {
    const generateTokenMail = await spyOn(
      usersTokensRepositoryInMemory,
      "create"
    );

    usersRepositoryInMemory.create({
      driver_license: "049971",
      email: "kobukcad@futwowfij.at",
      name: "Maria Allison",
      password: "84283623",
    });

    await sendForgotPasswordMailUseCase.execute("kobukcad@futwowfij.at");

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
