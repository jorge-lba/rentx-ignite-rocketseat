import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAvailableCarsUseCase, IRequest } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { brand, category_id, name } = request.query as IRequest;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase
    );

    const cars = await listAvailableCarsUseCase.execute({
      brand,
      name,
      category_id,
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
